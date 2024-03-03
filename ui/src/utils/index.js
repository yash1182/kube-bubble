export const getServices = (namespace) => {
  return window.electron.getDeployments(namespace);
};

export const getServicePods = (service, namespace) => {
  return window.electron.getDeploymentPods(service, namespace);
};

export const getPodHealth = (pods) => {
  if (pods.filter((item) => ["Pending"].includes(item.status.phase)).length) {
    return "Pending";
  } else if (pods.filter((item) => item.status.phase === "Running").length) {
    return "Healthy";
  } else {
    return "Unknown";
  }
};

export const restartDeployment = (service, namespace) => {
  return window.electron.restartDeployment(service, namespace);
};
