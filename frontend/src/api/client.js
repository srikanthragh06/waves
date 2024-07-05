import axios from "axios";

const baseURL = process.env.REACT_APP_API_PATH;

const client = axios.create({ baseURL });

export default client;
