import React from 'react';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Typography, withWidth } from '@material-ui/core';
import { saveUserInfo } from './api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    margin: 100
  },
  submit: {
    marginTop: 20,
    width: 150
  }
}))

export default function LogIn(props) {
  const classes = useStyles();
  const [usernameInput, setUsername] = React.useState("");
  const [passwordInput, setPassword] = React.useState("");
  const [firstnameInput, setFirstname] = React.useState("");
  const [lastnameInput, setLastname] = React.useState("");
  const [dev, setDev] = React.useState(false);
  const [companynameInput, setCompanyname] = React.useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("submitted");
    let userInfo = {
      username: usernameInput,
      password: passwordInput,
      firstname: firstnameInput,
      lastname: lastnameInput,
      dev: dev,
      companyname: companynameInput
    }
    console.log("userInfo", userInfo)

    
    const response = await saveUserInfo(userInfo);
    //console.log("handleSubmit2", response);
    userInfo = {
      response
    }
    
    if (response.data.success) props.handleNewUser(userInfo);
    else alert(response.data.message);
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleFirstname = (event) => {
    setFirstname(event.target.value);
  }

  const handleLastname = (event) => {
    setLastname(event.target.value);
  }

  const handleDevChange = (event) => {
    setDev(event.target.checked);
  }

  const handleCompanyname = (event) => {
    setCompanyname(event.target.value);
  }

  const handleUnregistered = () => {
    props.handleRegistered();  
  }
  

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
    <FormGroup>
      <TextField
        variant="filled"
        id="username-register"
        label="username"
        onChange={(e) => handleUsername(e)}
        placeholder="username"
      />
      <br />
      <TextField
        variant="filled"
        id="password-register"
        type="password"
        label="password"
        onChange={(e) => handlePassword(e)}
        placeholder="password"
      />
      <br />
      <TextField
        id="firstname-register"
        label="firstname"
        onChange={(e) => handleFirstname(e)}
        placeholder="first name"
      />
      <br />
      <TextField
        id="lastname-register"
        label="lastname"
        onChange={(e) => handleLastname(e)}
        placeholder="last name"
      />
      <br/>
      <FormControlLabel
        control={<Checkbox checked={dev} onChange={handleDevChange} name="Developer" />}
        label="Developer"
      />
      {dev &&
        <TextField
          id="companyname-register"
          label="companyname"
          onChange={(e) => handleCompanyname(e)}
          placeholder="company name"
        />
      }
      
      
      <br />
       
    </FormGroup>
    <ButtonGroup variant="contained" className={classes.submit}>
      <Button color="primary" type="submit">Submit</Button>
      <Button color="secondary" >Cancel</Button>
    </ButtonGroup>
    </form>
    <p>Already registered? click <Link component="button" onClick={() => handleUnregistered()}>here</Link></p>
    </div>  
  )
}