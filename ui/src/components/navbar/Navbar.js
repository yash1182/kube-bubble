import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link
            className="nav-link"
            data-widget="pushmenu"
            to={"/"}
            role="button"
          >
            <i className="fas fa-bars"></i>
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link className="nav-link" to={"/"}>
            Dashboard
          </Link>
        </li>
      </ul>
      <span
        onClick={() => {
          navigate(-1);
        }}
      >
        <FontAwesomeIcon icon={faBackward} />
      </span>
    </nav>
  );
};

export default Navbar;
