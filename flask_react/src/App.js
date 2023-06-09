import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/index";
import Register from "./views/register";
import Login from "./views/login";
import DashboardContentUser from "./views/userHome";
import Posts from "./views/posts";
import Follows from "./views/follows"
import Friends from "./views/friends"
import FriendRequest from "./views/friendsRequest"
import Playlist from "./views/playlist"
import UserProfile from "./views/userProfile"
import ShowSongs from "./views/showSongs"
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/posts" element={<Posts/>} />
          <Route exact path="/follows" element={<Follows/>} />
          <Route exact path="/friends" element={<Friends/>} />
          <Route exact path="/friend-request" element={<FriendRequest/>} />
          <Route exact path="/userhome" element={<DashboardContentUser/>} />
          <Route exact path="/playlist" element={<Playlist/>} />
          <Route exact path="/userprofile" element={<UserProfile/>} />
          <Route exact path="/playlistsongs/:title" element={<ShowSongs />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
