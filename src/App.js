import React,{useEffect} from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector,useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./App.css";
import { setUser,logout } from "./Redux/authSlice";
import {auth} from './Config/Fire'
import Footer from "./Components/footer"
import Gallery from "./Components/Gallery";
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
import Loader from "./Components/Loader";
import Reviews from "./Components/reviews";

function App() {
  const user = useSelector((state) => state.auth.user);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName, 
        }));
      } else {
      
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  
  const initialOptions = {
    "client-id": "AQ_HmNqCVIsOc08T04ndI1zpPZk9gkCG1r1MMcIlDh_m9in5XkfHdRewNUZU23jAKWYt0F_2rN-TfuOC",
    "enable-funding": "venmo",
    currency: "USD",
  };
  const {loading } = useSelector((state) => state.auth || {});

  return (
    <PayPalScriptProvider options={initialOptions}> 
      <Router>
      {loading ? (  
            <Loader />
          ) : (
            <div className="App">
            <Routes>
              <Route path="/" element={user ? <Home /> : <Register />} />

              <Route path ="/reviews" element={<Reviews/>}/>
              <Route path="/footer" element={<Footer/>}/>
              <Route path="/gallery" element={<Gallery />}/>
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
          )}
     
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;