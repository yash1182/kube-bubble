import { useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { restartDeployment } from "../utils";
import { useState } from "react";
import RestartModal from "./modals/RestartModal";

const getStatusCss = (conditions) => {
  if (conditions.filter((item) => item.type === "Progressing").length) {
    return "info";
  } else if (conditions.filter((item) => item.type === "Available").length) {
    return "success";
  } else {
    return "secondary";
  }
};

const Small = ({ label, value }) => {
  return (
    <Row
      md={2}
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      <Col>
        <small>{label}:</small>
      </Col>
      <Col>
        <small>{value}</small>
      </Col>
    </Row>
  );
};

const DeploymentTile = ({ data }) => {
  const [restartModal, setRestartModal] = useState(false);
  const toggleRestartModal = () => setRestartModal(!restartModal);
  const navigate = useNavigate();

  const goToService = () => {
    navigate(`/services/${data?.metadata?.name}`, { state: data });
  };
  return (
    <div className="col-sm-3">
      <div
        className={`card card-success`}
        // className={`card card-${getStatusCss(data?.status?.conditions)}`}
      >
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3 className="card-title" onClick={goToService}>
            {data?.metadata?.name}
          </h3>
        </div>
        <div className="card-body">
          <div className="col">
            <Small label={"Namespace"} value={data?.metadata?.namespace} />
            <Small
              label={"Created At"}
              value={
                data?.metadata?.creationTimestamp &&
                new Date(data?.metadata?.creationTimestamp).toLocaleDateString()
              }
            />
            <Row md={5} style={{ alignContent: "center", margin: "auto" }}>
              <Col>
                <Badge color="info" pill onClick={toggleRestartModal}>
                  <FontAwesomeIcon icon={faSyncAlt} />
                </Badge>
                {restartModal && (
                  <RestartModal
                    toggle={toggleRestartModal}
                    isOpen={restartModal}
                    data={{
                      name: data.metadata.name,
                      type: "service",
                      namespace: data.metadata.namespace,
                    }}
                  />
                )}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentTile;
