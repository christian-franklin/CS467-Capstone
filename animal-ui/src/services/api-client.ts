import axios from "axios";

export default axios.create({
  baseURL: "https://animal-api-dot-cs467-capstone-393117.ue.r.appspot.com",
  //baseURL: "http://localhost:8080",
});
