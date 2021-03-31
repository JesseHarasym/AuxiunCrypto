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
            {
              // is user or developer?
              // if user, display balance on right side
              // if developer, display add item form
              props.user.user.developer ? (
                <DevItemForm user={props.user}></DevItemForm>
              ) : (
                <Balance
                  user={props.user}
                  handleUpdateBalance={props.handleUpdateBalance}
                ></Balance>
              )
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
