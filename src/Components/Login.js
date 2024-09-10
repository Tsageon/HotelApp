import "./Login.css";
import React from 'react';
import Img from "./mt.png";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login">
      <div className="login__page">
        <div><img className="login__logo" src={Img} alt="Logo" /></div>
        <div className="login__content">
          <h2><b>Login</b></h2>
          <p>Welcome Back</p>
          <form><input type="email" id="email" name="email" placeholder="Enter Email" className="login__input" required />
            <input type="password" id="password" name="password" placeholder="Enter Password" className="login__input" minLength="6" required />
            <p className="login__forgot-txt"><b><i><Link to="/forgotpassword">Forgot Password?</Link></i></b></p>
            <button type="submit" className="login__btn">Login</button>
          </form>
          <p>Don't have an account?<b><Link to="/">Register here!</Link></b></p>
          <a href="/home">home</a>
        </div>
      </div>
    </div>
  );
};

export default Login;