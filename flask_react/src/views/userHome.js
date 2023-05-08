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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Menu from "@mui/material/Menu";
import CommentIcon from "@mui/icons-material/Comment";
import Rating from "@mui/material/Rating";
import AddIcon from "@mui/icons-material/Add";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import ReviewForm from "./reviewForm";
import RecentUpdates from "./recentUpdates";
import { useNavigate } from "react-router-dom";

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
let friendReqCount1 = 0;
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
const myObj = {
  _friendReqCount: 0,
  set friendReqCount(value) {
    this._friendReqCount = value;
  },
  get friendReqCount() {
    return this._friendReqCount;
  },
};
function DashboardContentUser() {
  const [open, setOpen] = React.useState(true);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate(`/userprofile`);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/home");
        setUsername(response.data.username);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGenreList = async () => {
      try {
        const response = await axios.get("/genre");
        setGenreList(response.data.genre);
        setLoading(false);
        console.log(response.data.genre);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get("/search", {
          params: {
            genre: genre,
            search: search,
            rating: rating,
          },
        });
        setResults(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPendingStatus = async () => {
      try {
        const response = await axios.get("/pending");
        friendReqCount1 = response.data[1].length;
        myObj.friendReqCount = response.data[1].length;
        console.log(response.data[1]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
    fetchGenreList();
    fetchSearchResults();
    fetchPendingStatus();
  }, [genre, search, rating]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get("/search", {
        params: {
          genre: genre,
          search: search,
          rating: rating,
        },
      })
      .then((response) => {
        const res = response.data;
        setResults(response.data);
        console.log(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const handleRating = (event, songId, stars) => {
    event.preventDefault();
    axios
      .post("/post-rating", {
        songId: songId,
        stars: stars,
      })
      .then((response) => {
        //setResult(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("/list-user-playlist");
      setPlaylist(response.data[1]);
      console.log(response.data[1]);
    } catch (error) {
      console.error(error);
    }
  };
  const style = {
    position: "absolute",
    top: "60%",
    left: "55%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 150,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const addSongToPlaylist = (playlistTitle, songId) => {
    if (!songId) {
      console.error("Error: song ID cannot be null");
      return;
    }
    axios
      .post("/addtoplaylist", {
        playlistTitle: playlistTitle,
        songID: songId,
      })
      .then((response) => {
        const res = response.data;
        console.log(res);
        console.log(playlistTitle);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open2, setOpen2] = React.useState(null);
  const handleOpen = (songID) => {
    setOpen2(songID);
  };
  const handleClose2 = () => setOpen2(null);
  const [post, setpost] = useState("");
  const handlePlaylistTittleChange = (event) => {
    setpost(event.target.value);
  };

  const [open3, setOpen3] = React.useState(null);
  const handleOpen3 = (songID) => {
    fetchPlaylist();
    setOpen3(songID);
  };
  const handleClose3 = () => setOpen3(null);

  const [playlist, setPlaylist] = useState([]);

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
              alignItems: "center",
              height: "70vh",
            }}
          >
            <Stack direction="column" spacing={2}>
              <Stack
                direction="column"
                spacing={1}
                style={{ textAlign: "center", paddingBottom: "50px" }}
              >
                <Typography variant="h2" gutterBottom>
                  Welcome To FatEAR™ 🎧
                </Typography>

                <Typography variant="subtitle1" align="center" gutterBottom>
                  This will be your favorite streaming platform
                </Typography>
              </Stack>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ textAlign: "center", paddingTop: "40px" }}
                >
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="company-select-label">Genre</InputLabel>
                      <Select
                        labelId="genre-select-label"
                        id="genre"
                        value={genre}
                        label="Genre"
                        onChange={handleGenreChange}
                      >
                        <MenuItem value="">None</MenuItem>
                        {genreList.map((genre, index) => (
                          <MenuItem key={index} value={genre.genre}>
                            {genre.genre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="company-select-label">Rating</InputLabel>
                      <Select
                        labelId="rating-select-label"
                        id="rating"
                        value={rating}
                        label="Rating"
                        onChange={handleRatingChange}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={1}>1+</MenuItem>
                        <MenuItem value={2}>2+</MenuItem>
                        <MenuItem value={3}>3+</MenuItem>
                        <MenuItem value={4}>4+</MenuItem>
                        <MenuItem value={5}>5+</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    color="primary"
                    placeholder="Find artist, songs and more..."
                    style={{ width: "30vw" }}
                    value={search}
                    onChange={handleSearchChange}
                  />

                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ width: 100 }}
                    style={{
                      textTransform: "none",
                      height: 56,
                    }}
                    color="primary"

                    //onClick={() => setSubmitSearch(search)}
                  >
                    Search
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Container>
          <Container>
            <Paper sx={{ p: 2 }}>
              {results?.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <div key={result.songID}>
                      <Stack direction="row" spacing={2} key={result.songID}>
                        <Container
                          maxWidth="sm"
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            height: "20vh",
                          }}
                        >
                          <div>
                            <p>
                              <strong>Artist:</strong> {result.fname}{" "}
                              {result.lname}
                            </p>
                            <p>
                              <strong>Title:</strong> {result.title}
                            </p>
                            <p>
                              <strong>Album:</strong> {result.albumTitle}
                            </p>
                            {result.genre && (
                              <p>
                                <strong>Genre:</strong> {result.genre}
                              </p>
                            )}
                          </div>
                        </Container>

                        <Container
                          maxWidth="sm"
                          sx={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "center",
                            height: "20vh",
                          }}
                        >
                          <Stack direction="row" spacing={2}>
                            <Box
                              sx={{
                                "& > legend": { mt: 2 },
                              }}
                            >
                              <Typography component="legend">
                                Rate Song
                              </Typography>
                              <Rating
                                key={result.songID}
                                name="simple-controlled"
                                value={result.stars}
                                onChange={(event, value) =>
                                  handleRating(event, result.songID, value)
                                }
                              />
                            </Box>

                            <Button
                              variant="contained"
                              onClick={() => handleOpen(result.songID)}
                            >
                              <CommentIcon style={{ paddingRight: "5px" }} />
                              Post
                            </Button>
                            <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              open={open2 === result.songID}
                              onClose={handleClose2}
                              closeAfterTransition
                              slots={{ backdrop: Backdrop }}
                              slotProps={{
                                backdrop: {
                                  timeout: 500,
                                },
                              }}
                            >
                              <Fade in={open2 === result.songID}>
                                <div>
                                  <ReviewForm songId={result.songID} />
                                </div>
                              </Fade>
                            </Modal>

                            <Button
                              variant="contained"
                              onClick={() => handleOpen3(result.songID)}
                            >
                              <AddIcon style={{ paddingRight: "5px" }} />
                              add
                            </Button>
                            <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              open={open3 === result.songID}
                              onClose={handleClose3}
                              closeAfterTransition
                              slots={{ backdrop: Backdrop }}
                              slotProps={{
                                backdrop: {
                                  timeout: 500,
                                },
                              }}
                            >
                              <Fade in={open3 === result.songID}>
                                <Box
                                  component="form"
                                  noValidate
                                  // onSubmit={handleSubmit}
                                  sx={style}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    style={{
                                      textAlign: "center",
                                      paddingBottom: "50px",
                                    }}
                                  >
                                    <Paper>
                                      <React.Fragment>
                                        {playlist.map((userPlaylist, idnx) => (
                                          <Stack
                                            key={idnx}
                                            direction="row"
                                            spacing={1}
                                            style={{
                                              textAlign: "center",
                                              margin: "10px",
                                            }}
                                          >
                                            <Button
                                              onClick={() =>
                                                addSongToPlaylist(
                                                  userPlaylist.playlistTitle,
                                                  result.songID
                                                )
                                              }
                                            >
                                              <p>
                                                {result.songID}
                                                <strong>
                                                  Playlist Title:
                                                </strong>{" "}
                                                {userPlaylist.playlistTitle}
                                              </p>
                                            </Button>
                                          </Stack>
                                        ))}
                                      </React.Fragment>
                                    </Paper>
                                  </Stack>
                                </Box>
                              </Fade>
                            </Modal>
                          </Stack>
                        </Container>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                    </div>
                  ))}
                </>
              ) : (
                <Typography variant="h6" gutterBottom>
                  No Songs
                </Typography>
              )}
            </Paper>
          </Container>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </ThemeProvider>
  );
}
export { friendReqCount1, myObj };
export default function Dashboard() {
  return <DashboardContentUser />;
}
