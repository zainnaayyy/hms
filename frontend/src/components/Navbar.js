import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import StyledButton from './controls/StyledButton';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  },
  nav: {
    margin: '0px 10px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  activeNav: {
    backgroundColor: theme.palette.secondary.main,
    BorderColor: theme.palette.secondary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  }
}));

export default function Navbar({ navs, activeNav, setActiveNav }) {
  const classes = useStyles();

  return (
    <Box>
      <AppBar
        position="static"
        elevation={0}
        color="primary"
      >
        <Toolbar style={{ flexDirection: 'column', padding: '10px' }}>
          <Box mb={1} mt={1} display="flex" justifyContent='center' width="100%">
            {navs.map((nav) => (
              <StyledButton
                disableElevation
                size="large"
                color="inherit"
                key={nav.name}
                customStyles={`${classes.nav} ${nav.name === activeNav ? classes.activeNav : ''}`}
                onClick={() => { setActiveNav(nav.name.toLocaleLowerCase()); }}
              >
                {nav.name}
              </StyledButton>
            ))
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
