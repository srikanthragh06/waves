import axios from "axios";

console.log(process.env.NODE_ENV);
const baseURL =
    process.env.NODE_ENV === "production"
        ? "api/"
        : "http://localhost:5000/api/";

const client = axios.create({ baseURL });

export default client;
