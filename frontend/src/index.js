import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ContextProviders from "./context/ContextProviders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <ContextProviders>
            <App />
        </ContextProviders>
    </BrowserRouter>
    // </React.StrictMode>
);
