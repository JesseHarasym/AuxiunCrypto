import React from "react";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import Link from "@material-ui/core/Link";
import { makeStyles, Typography, withWidth } from "@material-ui/core";
import { getUserInfo } from "../../../api";
import Register from "./register";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    margin: 100
  },
  submit: {
    marginTop: 20,
    width: 150
  }
}));

export default function LogIn(props) {
  const classes = useStyles();
  const [usernameInput, setUsername] = React.useState("");
  const [passwordInput, setPassword] = React.useState("");
  const [unregistered, setUnregistered] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userInfo = {
      username: usernameInput,
      password: passwordInput
    };

    // call the api to check username and get a response
    const response = await getUserInfo(userInfo);

    userInfo = {
      response
    };
    //console.log("userInfo", userInfo);
    // if successful, change the component view to homepage component and pass userInfo to the App state
    if (response.data.success) props.handleNewUser(userInfo);
    else alert(response.data.message);
  };


  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleRegistered = () => {
    if (unregistered) setUnregistered(false);
    else setUnregistered(true);
  };

  return (
    <div className={classes.root}>
      {unregistered ? (
        // registration form
        <Register
          unregistered={unregistered}
          handleRegistered={() => handleRegistered()}
          handleNewUser={props.handleNewUser}
        />
      ) : (
        // login form
        <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FormGroup>
            <TextField
              id="username-input"
              label="username"
              onChange={(e) => handleUsername(e)}
              placeholder="username"
            />
            <br />
            <TextField
              id="password-input"
              type="password"
              label="password"
              onChange={(e) => handlePassword(e)}
              placeholder="password"
            />
            <br />
            <ButtonGroup variant="contained" className={classes.submit}>
              <Button color="primary" type="submit">Submit</Button>
              <Button color="secondary">Cancel</Button>
            </ButtonGroup>
            <br />
            
          </FormGroup>
        </form>
        <div>Not yet registered? click <Link component="button" onClick={() => handleRegistered()}>here</Link></div>
        </div>
      }
    </div>
  );
}
