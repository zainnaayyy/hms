import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  li: {
    padding: '0px',
    justifyContent: props => props.centered ? 'center' : 'flex-start'
  },
  listIcon: {
    minWidth: 'auto'
  },
  listText: {
    paddingLeft: props => props.endIcon ? 0 : 5,
    paddingRight: props => props.endIcon ? 5 : 0,
    marginRight: props => props.mrtext ? props.mrtext : 0,
    marginLeft: props => props.mlText ? props.mlText : 0,
    flex: props => props.centered ? '0 0 auto' : '1 1 auto'
  }
}));



export default function IWT(props) {

  const { text, centered, endIcon, children, textBold, customStyles, textSizeRule, textWeightRule, ...other } = props;

  const classes = useStyles(props);

  return (
    <ListItem
      className={`${classes.li} ${customStyles}`}
      {...other}
    >
      {
        !endIcon
        &&
        <ListItemIcon className={classes.listIcon}>
          {children || null}
        </ListItemIcon>
      }

      <ListItemText
        className={`${classes.listText} ${textSizeRule} ${textWeightRule}`}
        primary={text}
      />

      {
        endIcon
        &&
        <ListItemIcon className={classes.listIcon}>
          {children || null}
        </ListItemIcon>
      }
    </ListItem>
  );
}