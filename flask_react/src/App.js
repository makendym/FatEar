import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/index";
import Register from "./views/register";
import Login from "./views/login";
import Home from "./views/home";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/home" element={<Home/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
