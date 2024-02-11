import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:5000/" });

export default client;
