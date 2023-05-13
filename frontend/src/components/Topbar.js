import React from 'react';
import { Box, makeStyles, useMediaQuery } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from "@material-ui/core/Avatar";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import StyledButton from './controls/StyledButton';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: props => props.color ? props.color : "#fdfdfd"
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 200
  },
  title: {
    flexGrow: 1
  },
  topbarBtn: {
    marginLeft: 6,
    fontWeight: 'bold',
    borderWidth: '3px',
    '&:hover': {
      borderWidth: '3px'
    }
  },
  link: {
    color: '#000',
    textDecoration: 'none',
  },
  topbarXs: {
    textAlign: 'center',
    '&:before': {
      content: '""',
      flexGrow: 1,
      flexBasis: 0,
      opacity: 0,
      visibility: 'hidden'
    },
    '& > :last-child': {
      flexGrow: 1,
      flexBasis: 0,
      textAlign: 'right'
    }
  }
}));

export default function Topbar({ responsive, sticky, color }) {
  const classes = useStyles({
    color
  });
  const xs = useMediaQuery('(max-width:599.95px)');

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  return (
    <Box px={xs ? 2.5 : 5} className={`${classes.root} navbarBox ${sticky ? classes.sticky : ''}`}>
      <AppBar
        position='static'
        elevation={0}
        color="transparent"
      >
        <Toolbar
          {...xs && responsive ? { className: `${classes.topbarXs}` } : {}}
        >
          <Typography variant="h6" className={classes.title}>
            <Link
              to='/'
              className={classes.link}
            >
              HMS
            </Link>
          </Typography>
          {
            userInfo
              ?
              <>
                <StyledButton
                  variant="outlined"
                  customStyles={classes.topbarBtn}
                  size="small"
                >
                  <Link to={`/${userInfo.category}/dashboard/profile`}>
                    Hi,
                    {userInfo.category === "customers" ? userInfo.firstName : userInfo.hotelName.split(' ')[0]}
                  </Link>
                </StyledButton>
                <Link to={`/${userInfo.category}/dashboard/profile`}>
                  <Avatar className="ml-2 user-avatar" src={"http://localhost:5000/" + userInfo.imageURL} />
                </Link>
              </>
              :
              <Box>
                <StyledButton
                  variant="outlined"
                  color="inherit"
                  customStyles={classes.topbarBtn}
                  size="small"
                >
                  <Link
                    to='/signin'
                  >
                    Sign In
                  </Link>
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  color="inherit"
                  customStyles={classes.topbarBtn}
                  size="small"
                >
                  <Link
                    to='/customers/signup'
                  >
                    Sign Up
                  </Link>
                </StyledButton>
              </Box>
          }
        </Toolbar >
      </AppBar >
    </Box >
  );
}
