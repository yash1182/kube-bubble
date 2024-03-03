import {
  faAlignLeft,
  faBox,
  faCalendarAlt,
  faCircleCheck,
  faFile,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Badge,
  Card,
  CardText,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  Row,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";

const SummaryTab = ({ data }) => {
  const summaryTabKeys = [
    {
      label: "Kind",
      value: data.kind,
    },
    {
      label: "Name",
      value: data.metadata.name,
    },
    {
      label: "Namespace",
      value: data.metadata.namespace,
    },
    {
      label: "Created At",
      value: new Date(data.metadata.creationTimestamp).toLocaleDateString(),
    },
    {
      label: "Images",
      value: data.spec.containers.map((item, key) => {
        return (
          <Badge pill key={key}>
            {item.image}
          </Badge>
        );
      }),
    },
    {
      label: "State",
      value: data.status.phase,
    },
  ];
  return (
    <TabPane tabId="1">
      <Row>
        <Col>
          <Card body>
            <CardText>
              {summaryTabKeys.map((item, key) => {
                return (
                  <Row
                    key={key}
                    md={3}
                    style={{
                      borderBottom: "1px solid #dee6eb",
                      paddingBottom: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Col md="4">{item.label}</Col>
                    <Col>{item.value}</Col>
                  </Row>
                );
              })}
            </CardText>
          </Card>
        </Col>
      </Row>
    </TabPane>
  );
};

const StatusTab = ({ data }) => {
  const [isLoading, setIsloading] = useState(true);
  const [events, setEvents] = useState([]);

  const renderType = (type) => {
    switch (type) {
      case "Warning":
        return <FontAwesomeIcon icon={faTriangleExclamation} color="red" />;
      default:
        return <FontAwesomeIcon icon={faCircleCheck} color="#37ed67" />;
    }
  };

  useEffect(() => {
    const getPodEvents = async () => {
      const res = await window.electron.getPodEvents(
        data.metadata.name,
        data.metadata.namespace
      );
      if (res.success) {
        setEvents(res.data);
        console.log(res.data);
      }
      setIsloading(false);
    };
    getPodEvents();
  }, []);
  return (
    <TabPane tabId="2">
      <Row>
        <Col>
          <Card body>
            <div className="container">
              <div className="row justify-content-center">
                <CardText>
                  {isLoading && <Spinner color="primary" />}
                  {!isLoading &&
                    (events.length ? (
                      <div>
                        {events.map((item, key) => {
                          return (
                            <Row
                              key={key}
                              md={2}
                              style={{
                                borderBottom: "1px solid #dee6eb",
                                paddingBottom: "10px",
                                overflow: "hidden",
                              }}
                            >
                              <Col md="2">{renderType(item.type)}</Col>
                              <Col md="3">{item.reason}</Col>
                              <Col>{item.message}</Col>
                            </Row>
                          );
                        })}
                      </div>
                    ) : (
                      <>No events available</>
                    ))}
                </CardText>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </TabPane>
  );
};

const LogsTab = ({ data }) => {
  return (
    <TabPane tabId="3">
      <Row>
        <Col>
          <Card body>
            <CardText>To Be Implemented</CardText>
          </Card>
        </Col>
      </Row>
    </TabPane>
  );
};

const PodModal = ({ data, isModal, toggle }) => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <div>
      <Modal
        isOpen={isModal}
        toggle={toggle}
        backdrop
        size="lg"
        style={{ maxWidth: "1000px", width: "200%" }}
      >
        <ModalHeader toggle={toggle}>
          <FontAwesomeIcon icon={faBox} color="lightblue" />{" "}
          {data.metadata.name}
        </ModalHeader>
        <ModalBody>
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "1" && "active"}
                  onClick={function noRefCheck() {
                    setActiveTab("1");
                  }}
                >
                  <FontAwesomeIcon icon={faFile} />
                  Summary
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" && "active"}
                  onClick={function noRefCheck() {
                    setActiveTab("2");
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} /> Events
                </NavLink>
              </NavItem>
              {window?.electron?.showPodLogs === "true" && (
                <NavItem>
                  <NavLink
                    className={activeTab === "3" && "active"}
                    onClick={function noRefCheck() {
                      setActiveTab("3");
                    }}
                  >
                    <FontAwesomeIcon icon={faAlignLeft} /> Logs
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={activeTab}>
              {activeTab === "1" ? <SummaryTab data={data} /> : ""}
              {activeTab === "2" ? <StatusTab data={data} /> : ""}
              {window.electron.showPodLogs === "true" && (
                <LogsTab data={data} />
              )}
            </TabContent>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PodModal;
