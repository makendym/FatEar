import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
function RecentUpdates() {
  const [newSongs, setNewSongs] = useState([]);
  const [newFriendRequests, setNewFriendRequests] = useState([]);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/get-notified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNewSongs(data.new_songs);
      setNewFriendRequests(data.new_friend_requests);
    }
    fetchData();
  }, []);

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleMenu}
      >
        <Badge badgeContent={newSongs.length + newFriendRequests.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
      >
        <MenuItem onClick={handleClose2}>
          <Stack direction="row" spacing={2}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h5" align="center" gutterBottom>
                New Songs{" "}
              </Typography>
              {newSongs.length === 0 ? (
                <p>No new songs.</p>
              ) : (
                <ul>
                  {newSongs.map((song) => (
                    <li key={song.title}>
                      {song.title} by {song.fname} {song.lname}
                    </li>
                  ))}
                </ul>
              )}
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="column" spacing={2}>
              <Typography variant="h5" align="center" gutterBottom>
                New Friend Requests{" "}
              </Typography>
              {newFriendRequests.length === 0 ? (
                <p>No new friend requests.</p>
              ) : (
                <ul>
                  {newFriendRequests.map((user) => (
                    <li key={user.username}>
                      {user.fname} {user.lname}
                    </li>
                  ))}
                </ul>
              )}
            </Stack>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}

export default RecentUpdates;
