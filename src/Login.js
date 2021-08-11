import React, { useState } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";

function Login() {
  const history = useHistory();
  // make sure to set to "" and NOT null
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    // preventDefault to stop page from refreshing
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");
      })
      .catch((error) => alert(error.message));
  };

  const register = (e) => {
    e.preventDefault();

    // create a user w/ email and password
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        // means the creation was successful
        console.log(auth);
        if (auth) {
          history.push("/");
        }
      })
      // catch and alert any errors
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
          alt=""
        />
      </Link>

      <div className="login__container">
        <h1>Sign-in</h1>

        <form>
          <h5>Email</h5>
          <input
            type="text"
            // value is connected to consts above
            // onChange sets the email to what the user types in -> e.target.value
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5>Password</h5>
          <input
            type="password"
            // value is connected to consts above
            // onChange sets the password to what the user types in -> e.target.value
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            // link the button to a function
            onClick={signIn}
            // type submit so hitting enter will work as well as clicking
            type="submit"
            className="login__signInButton"
          >
            Sign In
          </button>
        </form>

        <p>
          By signing-in you agree to the FAKE AMAZON Clone (created by Luke
          Narke) Conditions of Use & Sale. Please see our Privacy Notice, our
          Cookies Notice and our Interest-Based Ads Notice.
        </p>
        <button
          onClick={register}
          type="submit"
          className="login__registerButton"
        >
          Create an Amazon account now!
        </button>
      </div>
    </div>
  );
}

export default Login;
