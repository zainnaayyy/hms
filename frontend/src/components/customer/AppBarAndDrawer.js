import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import { Badge } from '@material-ui/core';
export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  logo: {
    color: "white",
    textDecoration: "none",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: activeReservation => activeReservation ? '#011627' : '#fff',
    '& *': {
      color: activeReservation => activeReservation ? '#fff' : '#011627'
    }
  },
  drawerPaperActiveReservation: {
    background: '#011627'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  active: {
    backgroundColor: theme.palette.action.selected,
  },
}));

function ResponsiveDrawer(props) {
  const { imageURL, category } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const { container, activeReservation, socket } = props;
  const classes = useStyles(activeReservation);
  const theme = useTheme();
  const { pathname } = useLocation();

  const isHome = false; // pathname === "/";
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [eventMounted, setEventMounted] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    if (socket && !eventMounted) {
      socket.on("getMessage", (data) => {
        //on getting message notify user
        if (data.message)
          setNewMessage(true);
      });
      setEventMounted(true);
    }
  }, [socket, eventMounted]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /* Modifying the source code from the template example to use the react router pathname hook to set
  selected prop and to use the react router component prop */

  const drawer = (
    <div>
      <div className={`${classes.toolbar} toolbar`}>Customer Dashboard</div>
      <Divider />
      <List>
        {[
          { text: "profile", icon: "person" },
          { text: "messenger", icon: "mail" },
          { text: "dashboard", icon: "dashboard" },
          { text: "reservations", icon: "room" },
          { text: "reservation room", icon: "cottage" },
          { text: "transactions", icon: "payment" },
          { text: "map", icon: "map" },
          { text: "logout", icon: "logout" },
        ].map(({ text, icon }, index) => {
          return category === 'customers' && text === 'map' ? null :
            (
              <ListItem
                className={activeReservation && text === 'reservation room' ? 'active-reservation' : ''}
                component={RouterLink}
                selected={pathname === `/customers/dashboard/profile/${text.replace(/\s/g, '')}`}
                to={text === 'messenger' ? '/messenger' : `/customers/dashboard/${text.replace(/\s/g, '')}`}
                button
                key={text}
              >
                <ListItemIcon>
                  {
                    activeReservation && text === 'reservation room' ?
                      <Badge badgeContent={activeReservation} color="error">
                        <Icon>{icon}</Icon>
                      </Badge>
                      : newMessage && text === 'messenger' ?
                        <Badge badgeContent="new" color="error">
                          <Icon>{icon}</Icon>
                        </Badge>
                        :
                        <Icon>{icon}</Icon>
                  }
                </ListItemIcon>
                <ListItemText primary={text.toUpperCase()} />
              </ListItem>
            );
        }
        )}
      </List>
      <Divider />
    </div >
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div
        style={{
          height: "64px",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "contrast(75%)",
          position: "absolute",
          top: "0px",
          width: "100%",
          zIndex: -2,
        }}
      />
      <AppBar position="sticky" className={isHome ? "" : classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            to={"/"}
            component={RouterLink}
            className={classes.logo}
          >
            HMS
          </Typography>
          <div style={{ flexGrow: 1 }}></div>
          <Link to="/messenger" className="inbox-icon">
            <MailIcon />
          </Link>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <Avatar src={"http://localhost:5000/" + imageURL} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isHome && !mobileOpen ? (
        <div />
      ) : (
        <nav aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open={isHome}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      )}
    </div>
  );
}

export default ResponsiveDrawer;
