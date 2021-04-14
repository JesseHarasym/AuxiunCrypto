import React, { useState, useEffect } from "react";
import Item from "./item";
import { fetchUserItems } from "../../../api";

export default function ItemList(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchUserItems(props.user.authKey).then((data) => {
      if (Array.isArray(data)) setItems(data);
    });
  }, []);

  useEffect(async () => {
    const fetchedData = await fetch("http://localhost:5000/api/user/assets", {
      headers: { "auth-token": props.user.authKey }
    })
      .then((res) => res.json())
      .then((data) => data);
    console.log("Fetched data: ", fetchedData);
    if (Array.isArray(fetchedData)) setItems(fetchedData);
    console.log(fetchedData);
  }, [items]);

  return (
    <div>

      <Typography variant="h2">
        Wallet
      </Typography>
      <br/>

      {items.length ? (

        items.map((item) => (
          <Item
            key={item.tokenId}
            items={item}
            setItems={setItems}
            home={props.home}
            user={props.user}
          />
        ))
      ) : (
        <p>No Items</p>
      )}
    </div>
  );
}
