import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/index";
import Register from "./views/register";
import Login from "./views/login";
import Home from "./views/home";
import DashboardContentUser from "./views/userHome";
import Posts from "./views/posts";
import Follows from "./views/follows"
import Friends from "./views/friends"
import FriendRequest from "./views/friendsRequest"
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/home" element={<Home/>} />
          <Route exact path="/posts" element={<Posts/>} />
          <Route exact path="/follows" element={<Follows/>} />
          <Route exact path="/friends" element={<Friends/>} />
          <Route exact path="/friend-request" element={<FriendRequest/>} />
          <Route exact path="/userhome" element={<DashboardContentUser/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
