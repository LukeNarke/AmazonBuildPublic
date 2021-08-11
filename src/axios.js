import axios from "axios";

const instance = axios.create({
  // the API (cloud function) URL
  baseURL: "url here",
  // "http://localhost:5001/build-ced72/us-central1/api/" --local host
  // keeping the local host just in case anything happens
  // firebase deploy hosting is the front end
  // firebase deploy functions is the back end
});

export default instance;
