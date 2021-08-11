import React, { useEffect, useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();

  // for Stripe
  const stripe = useStripe();
  const elements = useElements();

  // state
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  // generate the special stripe secret that lets us charge the customer that changes whenever the basket changes
  // when the basket changes, it will update the special stripe secret, which lets us charge the customer the correct amount
  useEffect(() => {
    const getClientSecret = async () => {
      // axios is a way for us to make requests and interact with APIs very easily
      const response = await axios({
        // it will be an endpoit for us to go to during the payment process
        method: "post",
        // Stripe expects total in a currencies subunits so need to refer to everything as cents
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
        // this will return us a client secret
      });
      setClientSecret(response.data.clientSecret);
    };
    // run function right after b/c it's async and inside of a useEffect hook
    getClientSecret();
  }, [basket]);

  console.log("the secret is >>>", clientSecret);

  const handleSubmit = async (e) => {
    // preventDefault stops the refresh
    e.preventDefault();
    // setProcessing to true will stop the user from hitting the buy button more than once
    setProcessing(true);
    // use the clientSecret to know how much to charge plus some other details
    // payment_method is the card, then find the card in the elements
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
        // paymentIntent is like the payment confirmation
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation
        // SQL style of the db
        db.collection("users")
          // need to use uid, NOT id
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        // setProcessing to false b/c nothing left to process
        setProcessing(false);
        // send them to orders so it stops them from going back to the payment page
        // this is why use replace not push
        dispatch({
          type: "EMPTY_BASKET",
        });
        history.replace("/orders");
      });
  };

  const handleChange = (e) => {
    // listen for changes in the CardElement
    // and dispaly any errors as the customer gives card info
    // if event is empty, disable the button
    // if there is an error, show the error otherwise show nothing
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout"> {basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p> {user?.email} </p>
            <p>123 React Lane</p>
            <p>Los Angeles, California</p>
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              // reuse this code we previously made for a better user experience AND programmer experiecne
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe code here */}

            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value} </h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span> {processing ? <p>Processing</p> : "Buy Now"} </span>
                </button>
              </div>
              {/* errors */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
