import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebars/Sidebar";

const Layout = ({ children, heading }) => {
  const Children = children;
  return (
    <div className="wrapper">
      <Navbar heading={heading} />
      <Sidebar />
      <div className="content-wrapper">
        <Children />
      </div>
    </div>
  );
};

export default Layout;
