import "./App.css";
import "./assets/css/adminlte.min.css";
import "./assets/js/adminlte.min.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "reactflow/dist/style.css";

import RouteComponent from "./routes/routes.js";

function App() {
  return (
    <div className="App">
      <RouteComponent />
    </div>
  );
}

export default App;
