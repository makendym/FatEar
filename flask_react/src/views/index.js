// import * as React from "react";

// function Index() {
//   return (
//     <>
//       <a href="/login">Login</a>
//       <br />
//       <a href="/register">Register</a>
//     </>
//   );
// }

// export default Index;
import * as React from "react";
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
                  This will be your favorite streaming platform(specify categories in the search)
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                style={{ textAlign: "center", paddingTop: "40px" }}
              >
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  color="primary"
                  placeholder="Find artist, songs and more..."
                  style={{ width: "30vw" }}
                />
                <Button
                  variant="outlined"
                  sx={{ width: 100 }}
                  style={{
                    textTransform: "none",
                    height: 56,
                  }}
                  color="primary"
                >
                  Search
                </Button>
              </Stack>
            </Stack>
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
