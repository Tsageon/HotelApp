import "./Login.css"; 
import React, { useEffect, useState } from "react";
import Img from "./mt.png";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../Redux/authSlice";
import { useAlert } from "./Alerts";
import TermsAndConditions from "./Tcs";
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const loading = useSelector((state) => state.auth.loading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const { user, error } = useSelector((state) => state.auth || {});
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();

  const handleAgreement = () => {
    setIsAgreed(true);
  };

  useEffect(() => {
    if (user) {
      console.log("User object after login:", user);
      
      if (isAdmin) {
        console.log('User is admin');
        showAlert("success", "Admin detected! Redirecting...");
        navigate("/admin");
      } else {
        console.log('User is not admin');
        showAlert("success", "Login successful!");
        navigate("/home");
      }
    }
  }, [user, isAdmin, navigate, showAlert]);
  
    const handleLogin = () => {
      if (!isAgreed) {
        Swal.fire({
          title: "Terms & Conditions",
          text: "You must agree to the Terms & Conditions before logging in.",
          icon: "warning",
          confirmButtonText: "Okay",
        });
        return;
      }      
    dispatch(signIn({ email, password }));
  };


  return (
    <div className="login">
         {loading ? (
        <Loader />
      ) : (
        <div>
           <div className="login__page">
        <div>
          <img className="login__logo" src={Img} alt="Logo" />
        </div>
        <div className="login__content">
          <h2>
            <b>Login</b>
          </h2>
          <p>Welcome</p>

          <input
            type="email"
            id="email"
            value={email}
            name="email"
            placeholder="Enter Email"
            className="login__input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Enter Password"
            className="login__input"
            minLength="6"
            required
          />
          <p>
            <b>
              <Link className="login__forgot-txt" to="/forgotpassword">
                Forgot Password?
              </Link>
            </b>
          </p>
          <TermsAndConditions onAgree={handleAgreement} /><br/>
          <button type="submit" className="login__btn" onClick={handleLogin}>
            Login
          </button>
            <>
              {error && <p>Error: {error}</p>}
              <p><br />
                Don't have an account?
                <b>
                  <Link to="/">Register here!</Link>
                </b>
              </p>
            </>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Login;