import "./Login.css";
import React, { useState, useEffect } from "react";
import Img from "./mt.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../Redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, error } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(signIn({ email, password }));
  };

  useEffect(() => {
    if (user) {
      if (user.email === "KB@gmail.com") {
        alert("Admin login successful!");
        navigate("/admin");
      } else {
        alert("Login successful!");
        navigate("/home");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login">
      <div className="login__page">
        <div>
          <img className="login__logo" src={Img} alt="Logo" />
        </div>
        <div className="login__content">
          <h2>
            <b>Login</b>
          </h2>
          <p>Welcome Back</p>
          
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
            required/>
          <p>    
           <b><Link className="login__forgot-txt" to="/forgotpassword">Forgot Password?</Link></b></p>
          <button type="submit" className="login__btn" onClick={handleLogin}> Login </button>
          {loading && <h1>Loading...</h1>}
          {error && <p>Error: {error}</p>}
          <p>
            Don't have an account?
            <b>
              <Link to="/">Register here!</Link>
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;