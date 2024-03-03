import { useEffect, useState } from "react";
import NatsTile from "../NatsTile";
import Spinner from "../Spinner";

const Nats = () => {
  const [pods, setPods] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  useEffect(() => {
    const getPods = async () => {
      const res = await window.electron.getNatsPods();
      if (res.success) {
        setPods(res.data);
      }
      setIsloading(false);
    };
    getPods();
  }, []);
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
            Nats
          </h1>
        </div>
      </div>
      <div className="content px-2">
        <div className="row">
          {isLoading ? (
            <Spinner />
          ) : (
            pods.map((item, key) => {
              return <NatsTile key={key} data={item} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Nats;
