import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import path from "./paths";

const loadRoutes = (routes, Layout) => {
  return routes.map((item) => {
    return (
      <Route
        key={item.path}
        path={item.path}
        element={<Layout heading={item?.title}>{item.component}</Layout>}
      ></Route>
    );
  });
};

const RouteComponent = () => {
  return (
    <Routes>
      <Route>{loadRoutes(path, Layout)}</Route>
    </Routes>
  );
};

export default RouteComponent;
