import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  account: {
    marginRight: 20,
    flexGrow: 1,
  }
}));

export default function NavBar(props) {
  const classes = useStyles();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [accAnchorEl, setAccAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const accOpen = Boolean(accAnchorEl);

 
  // Main Menu handling
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleHome = () => {
    setAnchorEl(null);
    props.handleSetHome();
  };

  const handleMarketplace = () => {
    setAnchorEl(null);
    props.handleSetMarketplace();
  };

  // Account Menu handling
  const handleAccMenu = (event) => {
    setAccAnchorEl(event.currentTarget);
  };

  const handleAccClose = () => {
    setAccAnchorEl(null);
  };

  


  return (
    <div className = {classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge = "start" className={classes.menuButton} color="inherit">
            <MenuIcon onClick={handleMenu} />
          </IconButton>
          <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleHome}>Home</MenuItem>
                <MenuItem onClick={handleMarketplace}>Marketplace</MenuItem>
              </Menu>
          <Typography variant = "h6" className={classes.title}>
            Auxiun
          </Typography>
          {props.loggedIn && (
            <div>  
              <IconButton
                className={classes.account}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => handleAccMenu(e)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={accAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={accOpen}
                onClose={handleAccClose}
              >
                <MenuItem onClick={handleAccClose}>Profile</MenuItem>
                <MenuItem onClick={handleAccClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}