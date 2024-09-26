import React, { useState,} from "react";
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { PayPalScriptProvider} from "@paypal/react-paypal-js";
import "./App.css";
import Forgotpassword from "./Components/Forgotpassword";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile"
import Room from "./Components/Room";
import Amenities from "./Components/Amenities";
import Contact from "./Components/Contact";
import Admin from "./Components/Admin";
import Reserve from "./Components/Reserve";
import CheckoutPayment from "./Components/Checkout";
import ShareAndFavorite from "./Components/Share";



function Message({ content }) {
  return <p>{content}</p>;
}

function App() {
  const initialOptions = {
    "client-id":"ATwp-NmB8ehhPMPHigRkdZ85dAmLIM51g-_YY0rsRUeRSiaeYVthITPu3fQAxgVbPlgTNdjymAwhkgcT", 
    intent: "capture",
    currency: "USD",
  };
  const user = useSelector((state) => state.auth.user);

  const [message, setMessage] = useState("");

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/profile" element={<Profile />}/>
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />}/>
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/checkout" element={<CheckoutPayment />} />
            <Route path="/share" element={<hareAndFavorite/>} />
            
          </Routes>

          {/* PayPal ButtonsPayment */}
        
          <Message content={message} />
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
