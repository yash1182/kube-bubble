import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  const [config, setConfig] = useState({
    currentContext: "",
    clusters: [],
    server: "",
  });

  //   {
  //     pod: "",
  //     isActive: false,
  //     logs:[]
  //   }

  const [forwardDetails, setForwardDetails] = useState([]);

  const updateForwardLogs = (message, pod) => {
    var details = [...forwardDetails];
    for (var item of details) {
      if (item.pod === pod) {
        item.logs.push(message);
      }
    }
    setForwardDetails(details);
  };

  const getKubeConfig = async () => {
    const res = await window.electron.getKubeConfig();
    if (res.success) {
      var server = "";
      if (res.data.currentContext.includes("qa")) {
        server = "QA";
      } else {
        server = "DEV";
      }
      setConfig({ ...res.data, server });
    }
  };

  const changeCurrentContext = async (clusterName) => {
    const res = await window.electron.changeCurrentContext(clusterName);
    if (res.success) {
      Swal.fire({
        title: "Success",
        text: "Cluster Configured Successfully!",
        icon: "success",
      });
      getKubeConfig();
    }
  };

  useEffect(() => {
    getKubeConfig();
    // window.electron.startVisualization();
  }, []);
  useEffect(() => {
    const socket = window.socket;
    socket.on("event", (message, pod) => {
      updateForwardLogs(message, pod);
    });
    socket.on("nats_stopped", (pod) => {
      let details = [...forwardDetails];
      for (let detail of details) {
        if (detail.pod === pod) {
          detail.isActive = false;
        }
      }
      Swal.fire({
        title: "Success",
        text: `Port Forward Stopped for Pod: ${pod}`,
        icon: "success",
      });
      setForwardDetails(details);
    });
  }, [forwardDetails]);
  return (
    <Context.Provider
      value={{
        config,
        setConfig,
        getKubeConfig,
        changeCurrentContext,
        forwardDetails,
        setForwardDetails,
        updateForwardLogs,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
