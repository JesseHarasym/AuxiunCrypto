import React, { useState, useEffect } from "react";
import Item from "../Items/item";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "white"
  }
}));

export default function ItemList(props) {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  // useEffect(async () => {
  //   const fetchedData = await fetch(
  //     "http://localhost:5000/api/marketplace/assets"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => data);
  //   if (Array.isArray(fetchedData)) setItems(fetchedData);
  //   console.log(fetchedData);
  // }, []);

  // useEffect(async () => {
  //   const fetchedData = await fetch(
  //     "http://localhost:5000/api/marketplace/assets"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => data);
  //   if (Array.isArray(fetchedData)) setItems(fetchedData);
  //   console.log(fetchedData);
  // }, [items]);

  return (
    <div>
      <Typography variant="h2" className={classes.title}>
        Marketplace
      </Typography>
      <br />
      {items.length ? (
        items.map((item) => (
          <Item
            key={item.image}
            items={item}
            setItems={setItems}
            home={props.home}
            user={props.user}
            handleUpdateBalance={props.handleUpdateBalance}
          />
        ))
      ) : (
        <p>No Items</p>
      )}
    </div>
  );
}
