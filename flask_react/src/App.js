import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/index";
import Register from "./views/register";
import Login from "./views/login";
import Home from "./views/home";
import DashboardContentUser from "./views/userHome";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/home" element={<Home/>} />
          <Route exact path="/userhome" element={<DashboardContentUser/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
