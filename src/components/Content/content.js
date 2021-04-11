import React from "react";
import ItemList from "./Items/item-list";
import MarketPlace from "./marketplace/marketplace";
import Balance from "./balance/balance";
import DevItemForm from "./devItemForm/devItemForm";
import LogIn from "./login/login";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  marketplace: {
    background: "#333333"
  },
  logIn: {
    align: "center"
  }
}));

export default function Content(props) {
  const classes = useStyles();
  const [ToggleAddItems, setToggleAddItems] = React.useState(false);

  return (
    <div>
      {props.loggedIn ? (
        // When logged in, display the homepage components
        <Grid container spacing={2}>
          {
            // if Home is selected in the menu
            props.home ? (
              <Grid item xs={6}>
                <ItemList user={props.user} home={props.home} />
              </Grid>
            ) : (
              // else, if Marketplace is selected in the menu
              <Grid item xs={6} className={classes.marketplace}>
                <MarketPlace
                  user={props.user}
                  home={props.home}
                  handleUpdateBalance={props.handleUpdateBalance}
                />
              </Grid>
            )
          }
          <Grid item xs={6}>
          
        
          { ToggleAddItems ?
          //display the Add Items form when the Add Items Button is clicked
            <DevItemForm user={props.user} handleUpdateBalance={props.handleUpdateBalance} setToggleAddItems={setToggleAddItems}></DevItemForm>
          :
          //Otherwise display the balance. Balance will be the default and cannot be toggled if the user is not a developer
            <Balance
              user={props.user}
              handleUpdateBalance={props.handleUpdateBalance}
              setToggleAddItems={setToggleAddItems}
            ></Balance>  
          }  
          </Grid>
        </Grid>
      ) : (
        // else, display the login components
        <LogIn
          handleNewUser={props.handleNewUser}
          setUser={props.setUser}
          user={props.user}
        ></LogIn>
      )}
    </div>
  );
}
