import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { useEffect, useState } from "react";
import { ReactFlow } from "reactflow";
const LogsVisualizer = () => {
  const [logs, setLogs] = useState([]);
  const [visualLogs, setVisualLogs] = useState([]);
  const [visualTiles, setVisualTiles] = useState([
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ]);
  const [visualEdges, setVisualEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
  ]);

  useEffect(() => {
    window.electron.startVisualization();
    window.socket.on("logs", (log) => {
      try {
        log = JSON.parse(log);
        console.log(log.message);
        if (log.context.requestId === "kube-test-id") {
          setVisualLogs([...visualLogs, log]);
        }
        setLogs([...logs, log]);
      } catch (err) {}
    });
  }, [visualLogs]);
  return (
    <div className="content-header">
      <div style={{ display: "flex" }}>
        <h1
          style={{
            paddingRight: "10px",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          Logs Visualizer
        </h1>
      </div>
      <div className="content px-2">
        <div className="row">
          {/* <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow nodes={visualTiles} edges={visualEdges} />
          </div> */}
          {visualLogs.map((item) => {
            return (
              <Col key={item.timestamp}>
                <Card>
                  <CardTitle>{item.service}</CardTitle>
                  <CardText>{item.message}</CardText>
                </Card>
              </Col>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LogsVisualizer;
