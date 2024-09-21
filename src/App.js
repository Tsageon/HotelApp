import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Forgotpassword from "./Components/Forgotpassword";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Room from "./Components/Room";
import Amenities from "./Components/Amenities";
import Contact from "./Components/Contact";
import Admin from "./Components/Admin"
import Reserve from "./Components/Reserve";
import Checkout from "./Components/Checkout"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/reserve" element={<Reserve/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
