import { useState } from "react";
import {
  Button,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import useProvider from "../../hooks/useProvider";
import Swal from "sweetalert2";

const PortForwardModal = ({ data, isModal, toggle }) => {
  const [internalPort, setInternalPort] = useState("4222");
  const [externalPort, setExternalPort] = useState("4222");

  const { setForwardDetails, forwardDetails } = useProvider();

  const forwardPort = () => {
    if (
      forwardDetails.find((item) => item.pod === data.metadata.name)?.isActive
    ) {
      return Swal.fire({
        title: "Error",
        text: "Port forwarding already active for this pod!",
        icon: "warning",
      });
    }
    let details = [...forwardDetails];
    details = details.filter((item) => item.pod != data?.metadata?.name);
    setForwardDetails([
      ...details,
      { pod: data.metadata.name, isActive: true, logs: [] },
    ]);
    window.electron.forwardPort(data.metadata.name, internalPort, externalPort);
    Swal.fire({
      title: "Success",
      text: `Port Forward Started for POD: ${data.metadata.name}`,
      icon: "success",
    });
    toggle();
  };
  return (
    <div>
      <Modal isOpen={isModal} toggle={toggle} backdrop size="lg">
        <ModalHeader toggle={toggle}>{data.metadata.name}</ModalHeader>
        <ModalBody>
          <div>
            <FormGroup>
              <label htmlFor="internalPort">Internal Port:</label>
              <Input
                id="internalPort"
                name="internalPort"
                onChange={(e) => setInternalPort(e.target.value)}
                placeholder="Enter Internal Port"
                defaultValue={internalPort}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="externalPort">External Port:</label>
              <Input
                id="externalPort"
                name="externalPort"
                placeholder="Enter External Port"
                onChange={(e) => setExternalPort(e.target.value)}
                defaultValue={externalPort}
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" onClick={forwardPort}>
                Forward
              </Button>
            </FormGroup>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PortForwardModal;
