import React, { useEffect, useState } from "react";
import "./Orders.css";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import Order from "./Order";

function Orders() {
  // setting up the state
  const [orders, setOrders] = useState([]);
  const [{ basket, user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      // access users collection
      db.collection("users")
        // access the specific user
        .doc(user?.uid)
        // access that user's order
        .collection("orders")
        // desc = descending
        // order the orders based on the date created in descending order
        // most recent one at the top
        .orderBy("created", "desc")
        // onSnapshot gives us a real time snapshot of the database
        // if you push or remove something to the database, provide a real time response
        .onSnapshot((snapshot) =>
          // will return the orders as docs
          setOrders(
            // bundle the list into an array by mapping through it
            snapshot.docs.map((doc) => ({
              // for each doc, return an object with the id and data
              // everything in onSnapshot is real-time
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    } else {
      // if there is no user, setOrders to an empty array
      setOrders([]);
    }
    // need user in the brackets b/c that is our dependent
  }, [user]);
  return (
    <div className="orders">
      <h1>Orders</h1>
      <div className="orders__order">
        {orders?.map((order) => (
          <Order order={order} />
        ))}
      </div>
    </div>
  );
}

export default Orders;
