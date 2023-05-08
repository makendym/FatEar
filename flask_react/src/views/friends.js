import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MainListItems from "./listItems";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchUsers from "./searchUsers";
import { useNavigate } from "react-router-dom";
import RecentUpdates from "./recentUpdates";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        FatEAR™
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const Friends = () => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/home");
        setUsername(response.data.username);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const style = {
    position: "absolute",
    top: "60%",
    left: "55%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 150,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [userInfo, setUserInfo] = useState([]);

  const goToProfile = () => {
    navigate(`/`);
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get("/friends");
        setUserInfo(response.data[1]);
        console.log(response.data[1]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaylist();
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              FatEAR™ 🎧
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <Container
                maxWidth="sm"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "flex-end" }}
                >
                  <RecentUpdates />

                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleMenu}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={goToProfile}>Profile</MenuItem>
                  </Menu>
                </Stack>
              </Container>
              <Button
                variant="contained"
                size="medium"
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                  fontSize: "13px",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
            <Divider sx={{ my: 1 }} />
            {/* {secondaryListItems} */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "60px",
            }}
          >
            <Stack direction="column" spacing={2}>
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  paddingBottom: "50px",
                }}
              >
                <Typography variant="h3" gutterBottom>
                  Friends
                </Typography>

                <SearchUsers />
                <Paper style={{ width: "700px" }}>
                  {userInfo?.length > 0 ? (
                    <>
                      {userInfo.map((user, index) => (
                        <div key={index}>
                          <p>
                            <strong>Username:</strong> {user.user2}
                          </p>
                          <p>
                            <strong>First Name:</strong> {user.fname}
                          </p>
                          <p>
                            <strong>Last Name:</strong> {user.lname}
                          </p>
                          <Divider sx={{ my: 1 }} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <Typography variant="h6" gutterBottom>
                      No friends
                    </Typography>
                  )}
                </Paper>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </ThemeProvider>
  );
};
export default Friends;
