const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe =
  require("stripe")();
  // stripe key here

// API

// App config
const app = express();

// Middlewares
app.use(cors({ origin: true }));
// let's us send and pass data in json format
app.use(express.json());

// API routes
// dummy route to test if it's working
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  // accessing total from Payment.js file
  const total = request.query.total;

  console.log("Payment Rquest Received!", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, //subunits of the currency
    currency: "usd",
  });

  // 201 is things are good
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Listen command
exports.api = functions.https.onRequest(app);

// example endpoint
// http://localhost:5001/build-ced72/us-central1/api
