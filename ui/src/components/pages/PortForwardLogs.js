import { useState } from "react";
import useProvider from "../../hooks/useProvider";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

const PortForwardLogs = ({ data }) => {
  const { forwardDetails, setForwardDetails } = useProvider();
  const [selectedPod, setSelectedPod] = useState("Select Pod");
  const [selectedPodIndex, setSelectedPodIndex] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  //   const currentPod = forwardDetails.find(item=>item.pod)
  return (
    <div className="container">
      <div className="content-header">
        <div style={{ display: "flex" }}>
          <h1
            style={{
              paddingRight: "10px",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            Port Forward Logs
          </h1>
          <Col>
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret>{selectedPod}</DropdownToggle>
              <DropdownMenu
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <DropdownItem header>Pods</DropdownItem>
                {forwardDetails.map((item, key) => {
                  return (
                    <DropdownItem
                      key={key}
                      onClick={() => {
                        setSelectedPod(item.pod);
                        setSelectedPodIndex(key);
                      }}
                    >
                      {item.pod}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </Col>
          {selectedPod !== "Select Pod" ? (
            <Col>
              <Button
                color="danger"
                disabled={forwardDetails[selectedPodIndex].isActive === false}
                onClick={() => {
                  var details = [...forwardDetails];
                  for (var item of details) {
                    if (item.pod === selectedPod) {
                      item.isActive = false;
                    }
                  }
                  setForwardDetails(details);
                  window.electron.stopPortForward(selectedPod);
                }}
              >
                Stop
              </Button>
            </Col>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="content px-2">
        <div className="row">
          <Terminal
            name={
              selectedPod !== "Select Pod"
                ? selectedPod + " Logs"
                : "Port Forward Logs"
            }
            colorMode={ColorMode.Dark}
          >
            {forwardDetails[selectedPodIndex]?.logs?.map((item, key) => {
              return <TerminalOutput key={key}>{item}</TerminalOutput>;
            })}
          </Terminal>
        </div>
      </div>
    </div>
  );
};

export default PortForwardLogs;
