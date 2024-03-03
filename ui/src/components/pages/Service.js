import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { getPodHealth, getServicePods } from "../../utils";
import Spinner from "../Spinner";
import PodTile from "../PodTile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Service = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [podDetails, setPodDetails] = useState([]);
  const [isLoaded, SetIsLoaded] = useState(false);
  const [health, setHealth] = useState("");
  useEffect(() => {
    if (location?.state) {
      setData(location.state);
    }
  }, []);
  useEffect(() => {
    const loadPodDetails = async () => {
      try {
        const details = await getServicePods(
          data.metadata.name,
          data.metadata.namespace
        );
        setPodDetails(details);
        setHealth(getPodHealth(details));
        SetIsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    if (!data?.metadata) {
      return;
    }
    loadPodDetails();
    const interval = setInterval(loadPodDetails, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [data]);
  return (
    <div>
      <div
        style={{
          backgroundColor: "white",
          height: "100px",
          maxWidth: "100%",
          width: "100%",
          padding: "0px",
          display: "flex",
          marginRight: "auto",
        }}
      >
        <Row
          md={4}
          style={{
            border: "1px solid",
            borderColor: "#dee6eb",
          }}
        >
          <Col
            style={{
              marginTop: "7px",
              fontSize: "15px",
              whiteSpace: "nowrap",
            }}
          >
            Service Health
            <br />
            <span
              style={{
                margin: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              {health === "Healthy" && (
                <FontAwesomeIcon
                  size="2x"
                  style={{ paddingRight: "10px" }}
                  icon={faHeart}
                  color="#37ed67"
                />
              )}
              {health !== "Healthy" && <Spinner />}

              {health}
            </span>
          </Col>
        </Row>
      </div>
      <div className="content-header">
        <h1>Pods</h1>
      </div>
      <div className="content px-2">
        <Row md={2}>
          {isLoaded ? (
            podDetails.length ? (
              podDetails.map((pod, key) => {
                return <PodTile data={pod} key={key} />;
              })
            ) : (
              <center>No Pods Found!</center>
            )
          ) : (
            <Spinner />
          )}
        </Row>
      </div>
    </div>
  );
};

export default Service;
