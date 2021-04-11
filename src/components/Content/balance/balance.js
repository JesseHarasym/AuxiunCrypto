import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { buyTokens } from "../../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 30,
    marginTop: 30
  },
  button: {
    margin: 50
  }
}));

export default function Item(props) {
  const [balance, setBalance] = React.useState(0);
  const classes = useStyles();
  const { user } = props.user;
  const { authKey } = props.user;

  const handleBuyTokens = async () => {
    const coinAmount = 5;
    const data = {
      coinAmount,
      authKey: authKey
    };

    // call the api and add coinAmout to the users balance
    const response = await buyTokens(data);

    console.log(response);
    if (response.data.success)
      props.handleUpdateBalance(response.data.newBalance);
  };

  return (
    <div>
      <Typography className={classes.root}>
        Welcome, {user.username}
        <br />
        Balance: {parseFloat(user.coinbalance.toFixed(4))} tokens
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => handleBuyTokens()}
        className={classes.button}
      >
        Get More Tokens
      </Button>
    </div>
  );
}
