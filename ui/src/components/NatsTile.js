import { useState } from "react";
import PortForwardModal from "./modals/PortForwardModal";

const { Col, Card, CardTitle, Button } = require("reactstrap");

const NatsTile = ({ data }) => {
  const [isModal, setIsModal] = useState(false);
  const toggleModal = () => setIsModal(!isModal);
  return (
    <Col>
      <Card body>
        <CardTitle tag="h5">{data.metadata.name}</CardTitle>
        <Button onClick={() => setIsModal(true)} color="primary">
          Port Forward
        </Button>
      </Card>
      {isModal ? (
        <PortForwardModal data={data} isModal={isModal} toggle={toggleModal} />
      ) : (
        <></>
      )}
    </Col>
  );
};

export default NatsTile;
