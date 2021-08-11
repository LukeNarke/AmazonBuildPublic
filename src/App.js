import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51Ih70TCCPoEHorVcd6cq5nsbrj8rm6CsadIwwJQZzCKR6vFb12p1k8E0CcrsKIVRxzNSyPnw44fxlnaEkzsTtycL00rqrMCYHA"
);

function App() {
  // dispatch is the gun that fires info to the data layer
  const [{}, dispatch] = useStateValue();

  // useEffect is our listener that looks for who is logged in
  // a dynamic if statement, pretty much
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>>", authUser);

      if (authUser) {
        // the user logged in or was logged in
        dispatch({
          // this will fire off the event to shoot the info to the data layer
          // sets user to the authUser who logged in
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        // sets user to null
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    // use the react-router Router to determine what url will load the given components
    // always have default root at the bottom
    <Router>
      <div className="app">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            {/* Need to wrap Payment in Elements to get Stripe working */}
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
