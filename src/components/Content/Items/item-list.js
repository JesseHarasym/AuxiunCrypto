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

  return (
    <div>
      {items.length ? (
        items.map((item) => (
          <Item
            key={item.tokenId}
            items={item}
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
