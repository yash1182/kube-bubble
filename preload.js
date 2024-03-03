const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");
const spawn = require("child_process").spawn;

let forwardDetails = [];

let visualizationProcesses = [];

const { contextBridge, ipcRenderer } = require("electron");

const getDeployments = async (namespace) => {
  const { stdout, stderr } = await exec(
    `kubectl get deployment -n ${namespace} -o json`
  );
  const jsonStd = JSON.parse(stdout);
  return jsonStd?.items || [];
};

const getDeploymentPods = async (service, namespace) => {
  console.log(service);
  try {
    const { stdout, stderr } = await exec(
      `kubectl get pods -l app.kubernetes.io/name=${service} -n ${namespace} -o json`
    );
    const jsonStd = JSON.parse(stdout);
    return jsonStd?.items || [];
  } catch (err) {
    return [];
  }
};

const restartDeployment = async (service, namespace) => {
  const { stdout } = await exec(
    `kubectl rollout restart deployment/${service} -n ${namespace}`
  );
  //   const jsonStd = JSON.parse(stdout);
  //   return jsonStd?.items || [];
};

const deletePod = async (pod, namespace) => {
  const { stdout } = await exec(`kubectl delete pod ${pod} -n ${namespace}`);
  return stdout;
};

const parseCredentials = async () => {
  try {
    var fileContents = fs.readFileSync(
      path.join(process.env.HOME, ".aws", "credentials"),
      "utf-8"
    );

    fileContents = fileContents.split("\n");
    var [profile, accessId, accessKey] = fileContents;

    profile = profile.replace("[", "").replace("]", "");
    accessId = accessId.includes("=") ? accessId.split("=")[1].trim() : "";
    accessKey = accessKey.includes("=") ? accessKey.split("=")[1].trim() : "";
    return {
      error: null,
      data: { accessId, accessKey, profile },
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
      data: null,
      success: false,
    };
  }
};

const saveAWSCrendentials = async (accessId, accessKey) => {
  try {
    var dummyData = `[default]\naws_access_key_id = ${accessId}\naws_secret_access_key = ${accessKey}`;
    const res = fs.writeFileSync(
      path.join(process.env.HOME, ".aws", "credentials"),
      dummyData,
      { encoding: "utf-8" }
    );
    console.log(res);
    return {
      error: null,
      data: null,
      success: true,
    };
  } catch (err) {
    return {
      error: err,
      data: null,
      success: false,
    };
  }
};

const getKubeConfig = async () => {
  const { stderr, stdout } = await exec(`kubectl config view -o json`);
  const jsonStd = JSON.parse(stdout);
  var clusters = jsonStd.clusters.reduce((clusters, cluster) => {
    clusters.push(cluster.name.split("/")[1]);
    return clusters;
  }, []);
  var currentContext = jsonStd["current-context"];
  currentContext =
    currentContext != null || currentContext != undefined
      ? currentContext.split("/")[1]
      : null;
  return {
    data: {
      currentContext,
      clusters,
    },
    success: true,
    error: null,
  };
};

const changeCurrentContext = async (clusterName) => {
  const { stderr, stdout } = await exec(
    `aws eks --region ap-south-1 update-kubeconfig --name ${clusterName}`
  );
  return {
    data: null,
    success: true,
    error: null,
  };
};

const getPodEvents = async (pod, namespace) => {
  try {
    const { stderr, stdout } = await exec(
      `kubectl get events -n ${namespace} --field-selector involvedObject.name=${pod} -o json`
    );
    const jsonStd = JSON.parse(stdout);
    return {
      data: jsonStd.items,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      success: false,
      error: err,
    };
  }
};

const getNatsPods = async () => {
  try {
    const { stderr, stdout } = await exec(
      `kubectl get pod -n namespace3 -o json`
    );
    const jsonStd = JSON.parse(stdout);
    return {
      data: jsonStd.items,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      success: false,
      error: err,
    };
  }
};

const forwardPort = (podname, internalPort, externalPort) => {
  const ps = spawn("bash", [
    "-c",
    `kubectl port-forward ${podname} ${internalPort}:${externalPort} -n namespace3`,
  ]);
  forwardDetails.push({
    pod: podname,
    ps: ps,
  });
  ps.stdout.on("data", (data) => {
    ipcRenderer.invoke("event", data.toString(), podname);
  });
  ps.stderr.on("data", (data) => {
    console.error(`ps stderr: ${data}`);
  });
};

const stopPortForward = (pod) => {
  const details = forwardDetails.find((item) => item.pod == pod);
  if (details) {
    console.log("stopping");
    details.ps.kill("SIGKILL");
    forwardDetails = forwardDetails.filter((item) => item.pod != details.pod);
    ipcRenderer.invoke("nats_stopped", details.pod);
  }
};

const startVisualization = async (serviceName, namespace) => {
  // first get all the pods
  const { stdout } = await exec(`kubectl get pods -n namespace1 -o=name`);
  const pods = stdout.split("\n");

  // now looping over pods to follow their logs
  for (let pod of pods) {
    const ps = spawn("bash", ["-c", `kubectl logs ${pod} -n namespace1 -f`]);
    // storing process info,so later can stop process

    visualizationProcesses.push({
      pod: pod,
      ps: ps,
    });

    ps.stdout.on("data", (data) => {
      ipcRenderer.invoke("logs", data.toString());
    });
  }
  console.log("============successfully started all logs============");
};

const showPodLogs = process.env.BUBBLE_DEV_TOOLS || false;

contextBridge.exposeInMainWorld("electron", {
  getDeployments,
  getDeploymentPods,
  restartDeployment,
  deletePod,
  showPodLogs,
  parseCredentials,
  saveAWSCrendentials,
  getKubeConfig,
  changeCurrentContext,
  getPodEvents,
  getNatsPods,
  forwardPort,
  stopPortForward,
  startVisualization,
});

contextBridge.exposeInMainWorld("socket", {
  send: (channel, ...data) => ipcRenderer.send(channel, ...data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
