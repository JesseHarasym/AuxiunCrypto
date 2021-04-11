import { PromiseProvider } from "mongoose";
import React, { useState, useEffect } from "react";
import Item from "./item";

export default function ItemList(props) {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const fetchedData = await fetch("http://localhost:5000/api/user/assets", {
      headers: { "auth-token": props.user.authKey }
    })
      .then((res) => res.json())
      .then((data) => data);
    console.log("Fetched data: ", fetchedData);
    setItems(fetchedData);
    console.log(fetchedData);
  }, []);

  return (
    <div>
      {items.length ?
        items.map((item) => (
          <Item
            key={item.image}
            items={item}
            home={props.home}
            user={props.user}
          />
        ))
      :
        <p>No Items</p>
      }
    </div>
  );
}
