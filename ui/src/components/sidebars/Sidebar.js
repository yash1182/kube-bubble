import {
  faFileInvoice,
  faGear,
  faTachometerAlt,
  faWandMagicSparkles,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import useProvider from "../../hooks/useProvider";

const items = [
  {
    title: "Dashboard",
    icon: faTachometerAlt,
    path: "/",
  },
  {
    title: "Configure",
    icon: faGear,
    path: "/configure",
  },

  {
    title: "Nats",
    icon: faWifi,
    path: "/nats",
  },
  {
    title: "Port Forward logs",
    icon: faFileInvoice,
    path: "/port-forward-logs",
  },
  {
    title: "Logs Visualizer",
    icon: faWandMagicSparkles,
    path: "/logs-visualizer",
    isDev: true,
  },
].filter((item) => {
  if (item.isDev && window.electron.showPodLogs === "true") {
    return true;
  } else if (!item.isDev) {
    return true;
  }
  return false;
});

const Sidebar = () => {
  const { config } = useProvider();
  const [active, setActive] = useState(0);
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to={"/dashboard"} className="brand-link">
        <img
          src={require("../../assets/img/kube_bubble.png")}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">Kube Bubble</span>
      </Link>
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="container">
          <div
            className="row justify-content-center"
            style={{
              alignContent: "center",
              margin: "auto",
              color: "rgb(255, 255, 255)",
            }}
          >
            Server: {config?.server}
          </div>
        </div>
      </div>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {items.map((item, key) => {
              return (
                <li
                  className="nav-item"
                  key={key}
                  onClick={() => {
                    setActive(key);
                  }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${key === active ? "active" : ""}`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <p>{item.title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
