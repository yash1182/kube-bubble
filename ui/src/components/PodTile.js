import {
  faBox,
  faCheckCircle,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
} from "reactstrap";
import PodModal from "./modals/PodModal";
import { useState } from "react";
import RestartModal from "./modals/RestartModal";

const PodTile = ({ data }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [options, setOptions] = useState(false);
  const toggleOptions = () => setOptions(!options);
  const [restartModal, setRestartModal] = useState(false);
  const toggleRestartModal = () => setRestartModal(!restartModal);
  return (
    <Col sm="3" style={{ paddingRight: "20px" }}>
      <div className="card text-center" style={{ width: "100%" }}>
        <div className="card-body">
          <Row md={3} style={{ display: "table" }}>
            <Col md={1} style={{ display: "table-cell" }}>
              <FontAwesomeIcon icon={faBox} color="lightblue" />
            </Col>
            <Col style={{ textWrap: "nowrap", display: "table-cell" }}>
              <p
                className="card-text"
                style={{ cursor: "pointer" }}
                onClick={toggleModal}
              >
                {data?.metadata?.name}{" "}
                {data.status.phase === "Running" && (
                  <FontAwesomeIcon icon={faCheckCircle} color="#37ed67" />
                )}
                {data.status.phase !== "Running" && (
                  <Spinner size={"sm"} color="info">
                    Loading...
                  </Spinner>
                )}
              </p>
            </Col>
            <Col style={{ display: "table-cell" }}>
              <Dropdown isOpen={options} toggle={toggleOptions}>
                <DropdownToggle data-toggle="dropdown" tag="span">
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{ cursor: "pointer" }}
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={toggleRestartModal}>
                    Restart
                  </DropdownItem>
                  {restartModal && (
                    <RestartModal
                      isOpen={restartModal}
                      toggle={toggleRestartModal}
                      data={{
                        name: data.metadata.name,
                        type: "pod",
                        namespace: data.metadata.namespace,
                      }}
                    />
                  )}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          {modal && (
            <PodModal toggle={toggleModal} isModal={modal} data={data} />
          )}
        </div>
      </div>
    </Col>
  );
};

export default PodTile;
