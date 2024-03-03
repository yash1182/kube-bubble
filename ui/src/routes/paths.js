import Configure from "../components/pages/Configure";
import Dashboard from "../components/pages/Dashboard";
import LogsVisualizer from "../components/pages/LogsVisualizer";
import Nats from "../components/pages/Nats";
import PortForwardLogs from "../components/pages/PortForwardLogs";
import Service from "../components/pages/Service";

const path = [
  {
    title: "Dashboard",
    path: "/",
    component: Dashboard,
  },
  {
    title: "Service",
    path: "/services/:serviceName",
    component: Service,
  },
  {
    title: "Configure",
    path: "/configure",
    component: Configure,
  },
  {
    title: "Nats",
    path: "/nats",
    component: Nats,
  },
  {
    title: "Port Forward Logs",
    path: "/port-forward-logs",
    component: PortForwardLogs,
  },
  {
    title: "Logs Visualizer",
    path: "/logs-visualizer",
    component: LogsVisualizer,
  },
];

export default path;
