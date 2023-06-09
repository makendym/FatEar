import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";

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

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = useState(true);
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const login = () => {
    navigate(`/login`);
  };

  const register = () => {
    navigate(`/register`);
  };

  useEffect(() => {
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
    fetchGenreList();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

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
  useEffect(() => {
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
  fetchSearchResults();
}, [genre, search]);

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
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
              <Button variant="contained" onClick={login}>
                Login
              </Button>
              <Button variant="contained" onClick={register}>
                Sign Up
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

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
                    <>
                      <Stack direction="row" spacing={2} key={index}>
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
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                    </>
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

export default function Dashboard() {
  return <DashboardContent />;
}
