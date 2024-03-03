import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const RestartModal = ({ isOpen, toggle, data }) => {
  const restartPod = () => {
    window.electron.deletePod(data?.name, data.namespace);
    toggle();
  };
  const restartService = () => {
    window.electron.restartDeployment(data?.name, data.namespace);
    toggle();
  };
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} size="lg">
        <ModalHeader toggle={toggle}>Restart {data?.name}</ModalHeader>
        <ModalBody>
          Do you want to restart <b>{data.name}</b>
          {data?.type === "pod" ? " Pod" : ""}?
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            onClick={data.type === "pod" ? restartPod : restartService}
          >
            Restart
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RestartModal;
