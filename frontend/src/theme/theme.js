import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors';

// const original = createMuiTheme();
// original.shadows.splice(4, 1, '8px -4px 30px rgba(0, 0, 0, 0.19)');

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#334452',
      main: '#011627',
      dark: '#000f1b',
      contrastText: '#f4f4f4'
    },
    secondary: lightBlue,
    text: {
      primary: '#011627'
    }
  },
  typography: {
    fontFamily: 'Poppins',
    fontWeightLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 600,
    body2: {
      fontSize: '0.92rem'
    }
  },
  //overriding the text-transform style rule of the .root class for the MuiButton Component
  overrides: {
    MuiStepIcon: {
      root: {
        '&$completed': {
          color: '#28a745',
        },
        '&$active': {
          color: '#00b0ff',
        },
      },
      active: {},
      completed: {},
    },
    MuiButton: {
      root: {
        textTransform: 'capitalize'
      }
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline > legend": {
          fontSize: "0.85rem"
        },
        "&:hover $notchedOutline > legend": {
          fontSize: "0.85rem"
        },
        "&$focused $notchedOutline > legend": {
          fontSize: "0.85rem"
        }
      }
    }
  },
  props: {
    MuiButton: {
      disableRipple: true
    }
  },
  // shadows: original.shadows
});

export default theme;