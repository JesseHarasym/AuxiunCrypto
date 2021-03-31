import React from "react";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import { makeStyles, Typography, withWidth } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import { json } from "body-parser";
//import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    paddingRight: 50
  },
  submit: {
    marginTop: 20,
    width: 150
  },
  formGroup: {
    marginTop: 20
  },
  formControl: {
    //margin: theme.spacing(1),
    width: 300
  },
  input: {
    marginTop: 20
  }
}));

export default function DevItemForm(props) {
  const classes = useStyles();
  const [singleMulti, setSingleMulti] = React.useState("");
  const [multi, setMulti] = React.useState(false);
  const [itemName, setItemName] = React.useState("");
  const [itemDescription, setItemDescription] = React.useState("");
  const [itemPrice, setItemPrice] = React.useState(0);
  const [itemGame, setItemGame] = React.useState("");
  const [itemFile, setItemFile] = React.useState(null);
  const { authKey } = props.user;

  const handleSelect = (event) => {
    setSingleMulti(event.target.value);
    if (event.target.value == "Multiple") setMulti(true);
    else setMulti(false);
  };

  const handleItemName = (event) => {
    setItemName(event.target.value);
  };

  const handleDescription = (event) => {
    setItemDescription(event.target.value);
  };

  const handleItemGame = (event) => {
    setItemGame(event.target.value);
  };

  const handleItemFile = (event) => {
    setItemFile(event.target.files[0]);
  };

  const handlePrice = (event) => {
    setItemPrice(parseFloat(event.target.value).toFixed(2));
  };

  const handleSubmit = async () => {
    // call to the api goes here
    // I have created an api.js file that will contain
    // all the outgoing api calls
    // you can reference login.js to see how that is done.

    // const body = {
    //   name: itemName,
    //   description: itemDescription,
    //   game: itemGame,
    //   price: itemPrice,
    //   file: itemFile
    // };

    // console.log(body.file);

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", itemDescription);
    formData.append("game", itemGame);
    formData.append("price", itemPrice);
    //formData.append("multi", multi);
    formData.append("file", itemFile);

    const resData = await fetch("http://localhost:5000/api/dev/asset/new", {
      method: "POST",
      headers: { "auth-token": authKey },
      body: formData
    })
      .then((res) => res.json())
      .then((data) => data);

    alert(resData.msg);
    console.log(resData);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h2" component="h2">
        Add Items
      </Typography>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="singleMultiSelect">
          Single or Multiple Tokens
        </InputLabel>
        <Select
          labelId="singleMultiSelect"
          id="singleMultiSelect"
          value={singleMulti}
          onChange={handleSelect}
        >
          <MenuItem value={"Single"}>Single</MenuItem>
          <MenuItem value={"Multiple"}>Multiple</MenuItem>
        </Select>
      </FormControl>
      <FormGroup className={classes.formGroup}>
        <Input
          id="itemName"
          label="Item Name"
          placeholder="Item Name"
          onChange={(e) => handleItemName(e)}
          className={classes.input}
        />
        <TextField
          id="itemDescription"
          label="Item Description"
          variant="outlined"
          multiline
          rows={4}
          placeholder="Item Description"
          onChange={(e) => handleDescription(e)}
          className={classes.input}
        />
        <Input
          id="itemGame"
          label="Game"
          placeholder="Game"
          onChange={(e) => handleItemGame(e)}
          className={classes.input}
        />
        <Button variant="outlined" color="default" className={classes.input}>
          Upload Image
          <Input
            id="itemFile"
            label="Image Upload"
            type="file"
            onChange={(e) => handleItemFile(e)}
            // hidden
          />
        </Button>
        <Input
          id="itemPrice"
          label="Price"
          placeholder="Price"
          className={classes.input}
          onChange={(e) => handlePrice(e)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />

        {multi && (
          <Input
            id="numTokens"
            label="Number of Tokens"
            placeholder={100}
            className={classes.input}
            endAdornment={
              <InputAdornment position="end">Tokens</InputAdornment>
            }
          />
        )}
        <br />
        <ButtonGroup variant="contained" className={classes.submit}>
          <Button color="primary" type="submit" onClick={() => handleSubmit()}>
            Submit
          </Button>
          <Button color="secondary">Cancel</Button>
        </ButtonGroup>
        <br />
      </FormGroup>
    </div>
  );
}
