import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { LIGHTER_WHITE, THEME_COLOR } from "../../helpers/colors";
import {
  airlineNavLinks,
  AIRLINE_USER,
  BACKEND_BASE_URL,
} from "../../helpers/variables";
import { Outlet, useLocation, useNavigate } from "react-router";
import CFWButton from "../form/CFWButton";

const drawerWidth = 275;

const Main = styled("main", { shouldForwardProp: prop => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Airline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const airline = JSON.parse(localStorage.getItem(AIRLINE_USER));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigateToPath = path => {
    if (path === location.pathname) return;
    navigate(path);
  };

  const logoutUser = () => {
    localStorage.removeItem(AIRLINE_USER);
    navigateToPath("/auth/airline/signin");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: THEME_COLOR,
            boxSizing: "border-box",
            color: LIGHTER_WHITE,
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <div className='airline__nav'>
          <div className='airline__nav__logo'>
            <img
              src={
                airline?.user?.image?.includes("http")
                  ? airline?.user?.image
                  : `${BACKEND_BASE_URL}/${airline?.user?.image}`
              }
              alt=''
            />
          </div>

          <div className='airline__nav__links'>
            {airlineNavLinks.map(lk => (
              <div
                className={`airline__nav__links__link ${
                  location.pathname === lk.path &&
                  "airline__nav__links__link--selected"
                }`}
                key={lk.path}
                onClick={() => navigateToPath(lk.path)}
              >
                <div className='airline__nav__links__link__icon'>
                  <i className={lk.icon}></i>
                </div>
                <span>{lk.name}</span>
              </div>
            ))}
          </div>

          <div className='airline__nav__logout'>
            <CFWButton
              title='Logout'
              style={{
                background: LIGHTER_WHITE,
                color: THEME_COLOR,
                width: "14rem",
              }}
              onClick={logoutUser}
            />
          </div>
        </div>
      </Drawer>
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default Airline;
