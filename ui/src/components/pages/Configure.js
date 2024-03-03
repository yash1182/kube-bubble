import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
} from "reactstrap";
import Swal from "sweetalert2";
import useProvider from "../../hooks/useProvider";

const Configure = () => {
  const { changeCurrentContext, config } = useProvider();
  console.log(config);
  const [accessId, setAccessId] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [open, setOpen] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  const parse = async () => {
    const res = await window.electron.parseCredentials();
    if (res.success) {
      setAccessId(res.data.accessId);
      setAccessKey(res.data.accessKey);
    }
  };

  const submit = async () => {
    if (isSubmit) {
      return;
    }
    setIsSubmit(true);
    const res = await window.electron.saveAWSCrendentials(accessId, accessKey);
    if (res.success) {
      Swal.fire({
        title: "Success",
        text: "AWS Credentials Configured Successfully!",
        icon: "success",
      });
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    parse();
  }, []);
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
          Configure
        </h1>
      </div>
      <Accordion open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="1">Configure Credentials</AccordionHeader>
          <AccordionBody accordionId="1">
            <div className="container">
              <div className="row justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <label htmlFor="access_id">Access ID:</label>
                    <Input
                      type="password"
                      id="access_id"
                      placeholder="Enter Access ID"
                      name="access_id"
                      onChange={(e) => {
                        setAccessId(e.target.value);
                      }}
                      defaultValue={accessId}
                    />
                  </FormGroup>
                </Col>
              </div>
              <div className="row justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <label htmlFor="access_key">Access Key:</label>
                    <Input
                      type="password"
                      id="access_key"
                      name="access_key"
                      placeholder="Enter Access Key"
                      onChange={(e) => {
                        setAccessKey(e.target.value);
                      }}
                      defaultValue={accessKey}
                    />
                  </FormGroup>
                </Col>
              </div>
              <div className="row justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Button
                      color="primary"
                      disabled={isSubmit}
                      type="button"
                      onClick={submit}
                    >
                      Submit
                    </Button>
                  </FormGroup>
                </Col>
              </div>
            </div>
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="2">Configure Server</AccordionHeader>
          <AccordionBody accordionId="2">
            <div className="container">
              <div className="row justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                        {config?.currentContext}
                      </DropdownToggle>
                      <DropdownMenu
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <DropdownItem header>Context</DropdownItem>
                        {config?.clusters.map((item, key) => {
                          return (
                            <DropdownItem
                              key={key}
                              onClick={() => {
                                changeCurrentContext(item);
                              }}
                            >
                              {item}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>
              </div>
            </div>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Configure;
