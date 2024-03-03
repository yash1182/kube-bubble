import { useEffect, useState } from "react";
import { getServices } from "../../utils";
import DeploymentTile from "../DeploymentTile";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
} from "reactstrap";
import Spinner from "../Spinner";

const namespaces = ["Namespace1", "Namespace2"];

const Dashboard = () => {
  const [namespace, setNamespace] = useState("namespace1");
  const [services, setServices] = useState([]);
  const [servicesFiltered, setServicesFiltered] = useState([]);
  const [isLoaded, SetIsLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchField, setSearchField] = useState("");
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const loadServices = async () => {
      const services = await getServices(namespace);
      setServices(services);
      SetIsLoaded(true);
    };
    if (!namespace) {
      return;
    }

    SetIsLoaded(false);
    loadServices();
    const interval = setInterval(loadServices, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [namespace]);

  useEffect(() => {
    if (searchField === "" && services.length != servicesFiltered.length) {
      return setServicesFiltered(services);
    }
    setServicesFiltered(
      services.filter((item) => {
        if (item.metadata.name.includes(searchField)) return true;
        return false;
      })
    );
  }, [searchField, services]);

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
          Services
        </h1>
        <Col>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>{namespace}</DropdownToggle>
            <DropdownMenu
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <DropdownItem header>Namespaces</DropdownItem>
              {namespaces.map((item) => {
                return (
                  <DropdownItem
                    key={item}
                    onClick={() => {
                      setNamespace(item.toLowerCase());
                    }}
                  >
                    {item}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col>
          <FormGroup>
            <Input
              id="search"
              placeholder="Search Service"
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
            />
          </FormGroup>
        </Col>
      </div>
      <div className="content px-2">
        <div className="row">
          {isLoaded ? (
            servicesFiltered.length &&
            servicesFiltered.map((service, key) => {
              return <DeploymentTile data={service} key={key} />;
            })
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
