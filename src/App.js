import React, { useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./App.css";
import { setUser, logout, setLoading } from "./Redux/authSlice";
import { auth } from './Config/Fire';
import { AlertProvider } from "./Components/Alerts";
import Footer from "./Components/footer";
import Gallery from "./Components/Gallery";
import Forgotpassword from "./Components/Forgotpassword";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import Room from "./Components/Room";
import Amenities from "./Components/Amenities";
import Admin from "./Components/Admin";
import Reserve from "./Components/Reserve";
import CheckoutPayment from "./Components/Checkout";
import Loader from "./Components/Loader";
import Reviews from "./Components/Review";
import AboutUs from "./Components/AboutUs"


function App() {
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.auth || {});

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setLoading(true));
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });
    return () => unsubscribe();
  }, [dispatch]);


  const initialOptions = {
    "client-id": "AQ_HmNqCVIsOc08T04ndI1zpPZk9gkCG1r1MMcIlDh_m9in5XkfHdRewNUZU23jAKWYt0F_2rN-TfuOC",
    "enable-funding": "venmo",
    currency: "USD",
  };


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const spinner = document.getElementById('loading-spinner');
    if (loading) {
      spinner.style.display = 'block';
    } else {
      spinner.style.display = 'none';
    }
  }, [loading]);

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <AlertProvider>
          {loading ? (
            <Loader />
          ) : (
            <div className="App">
              <Routes>
                <Route path="/" element={user ? <Home /> : <Register />} />
                <Route path="/review" element={<Reviews />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/footer" element={<Footer />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<Forgotpassword />} />
                <Route path="/room" element={<Room />} />
                <Route path="/amenities" element={<Amenities />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/checkout" element={<CheckoutPayment />} />
              </Routes>
            </div>
          )}
        </AlertProvider>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;