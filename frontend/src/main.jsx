import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import{store} from "./redux/store.js";
import Toast from "./componets/ToastContainer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
    <Toast/>
      <App />
    </BrowserRouter>
  </Provider>
);
