import { useState } from "react";
import {
  Container,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Notifications from "./notification";
import axios from "axios";

export default function SearchUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const handleCloseNotification = () => {
    setSuccess("");
    setErrors("");
  };
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/search-users?q=${searchInput}`);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addFriend = async (requestedUser) => {
    try {
      const response = await axios.post("/add-friend", {
        requestedUser: requestedUser,
      });
      console.log(response.data.message); // retrieve the response data from the server
      setErrors(response.data.error);
      setSuccess(response.data.message);
    } catch (error) {
      console.log(error.e.error); // retrieve the error message from the server
      setErrors(error.response.data.error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "60px",
      }}
    >
      <Stack
        direction="column"
        spacing={1}
        style={{ textAlign: "center", paddingBottom: "50px" }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          color="primary"
          label="Search for users"
          placeholder="Search for users..."
          style={{ width: "40vw",  }}
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <List>
          {users.map((user) => (
            <div key={user.username}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.fname} ${user.lname}`}
                  secondary={user.username}
                />
                <IconButton
                  onClick={() => addFriend(user.username)}
                  edge="end"
                  aria-label="add"
                >
                  <PersonAddIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Stack>
      {success ? (
        <Notifications
          type="success"
          message={success}
          onClose={handleCloseNotification}
        />
      ) : (
        errors && (
          <Notifications
            type="error"
            message={errors}
            onClose={handleCloseNotification}
          />
        )
      )}
    </Container>
  );
}
