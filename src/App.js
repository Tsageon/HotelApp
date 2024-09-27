import React from "react";
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./App.css";
import Forgotpassword from "./Components/Forgotpassword";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import Room from "./Components/Room";
import Amenities from "./Components/Amenities";
import Contact from "./Components/Contact";
import Admin from "./Components/Admin";
import Reserve from "./Components/Reserve";
import CheckoutPayment from "./Components/Checkout";

function App() {
  const user = useSelector((state) => state.auth.user);
  const initialOptions = {
    "client-id": "AQ_HmNqCVIsOc08T04ndI1zpPZk9gkCG1r1MMcIlDh_m9in5XkfHdRewNUZU23jAKWYt0F_2rN-TfuOC",
    "enable-funding": "venmo",
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={initialOptions}> {/* Wrap your entire app */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route path="/room" element={<Room />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/checkout" element={<CheckoutPayment />} />
          </Routes>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
