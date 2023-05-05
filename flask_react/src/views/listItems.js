import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ForumIcon from "@mui/icons-material/Forum";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Badge from "@mui/material/Badge";

const MainListItems = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate(`/userHome`);
  };

  const goToPosts = () => {
    navigate(`/posts`);
  };

  const goToFollows = () => {
    navigate(`/follows`);
  };

  const goToFrieds = () => {
    navigate(`/friends`);
  };

  const goToFriendRequest = () => {
    navigate(`/friend-request`);
  };
  const goToPlaylist = () => {
    navigate(`/playlist`);
  };
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/home");
        setUsername(response.data.username);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <React.Fragment>
      <ListItemButton>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={username} />
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListItemButton onClick={goToHome}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={goToPosts}>
        <ListItemIcon>
          <Badge badgeContent={4} color="secondary">
            <ForumIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Posts" />
      </ListItemButton>
      <ListItemButton onClick={goToPlaylist}>
        <ListItemIcon>
          <MusicNoteIcon />
        </ListItemIcon>
        <ListItemText primary="Playlist" />
      </ListItemButton>
      <ListItemButton onClick={goToFollows}>
        <ListItemIcon>
          <Badge badgeContent={10} color="secondary">
            <PeopleIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Follows" />
      </ListItemButton>
      <ListItemButton onClick={goToFrieds}>
        <ListItemIcon>
          <Badge badgeContent={7} color="secondary">
            <BarChartIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Friends" />
      </ListItemButton>
      <ListItemButton onClick={goToFriendRequest}>
        <ListItemIcon>
          <Badge badgeContent={9} color="secondary">
            <PersonAddIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Friend Request" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainListItems;
