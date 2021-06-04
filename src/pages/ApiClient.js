import axios from "axios";

var url = "https://api.fusionpointcapital.com";
// var url = "http://155.138.208.177"

if (process.env.NODE_ENV == "development") {
  url = "http://localhost:8080";
}

console.log("ApiClient is ", url);

const client = axios.create({
  baseURL: url
});

export default client;
