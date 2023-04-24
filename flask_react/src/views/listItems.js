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
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import axios from "axios";

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
          <ForumIcon />
        </ListItemIcon>
        <ListItemText primary="Posts" />
      </ListItemButton>
      <ListItemButton onClick={goToFollows}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Follows" />
      </ListItemButton>
      <ListItemButton onClick={goToFrieds}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Friends" />
      </ListItemButton>
      <ListItemButton onClick={goToFriendRequest}>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Friend Request" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainListItems;
