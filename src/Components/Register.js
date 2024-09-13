import "./Register.css";
import React from 'react';
import { Link } from 'react-router-dom';
import Img from "./mt.png";

const Register = () => {
  return (
    <div className="register">
      <div className="register__page">
        <div><img className="register__logo" src={Img} alt="Logo" /></div>
        <div className="Register__content">
          <h2><b>Register</b></h2>
          <p>Please enter the required details to Create an account</p>
          <form><input type="text" id="text" name="name" placeholder="Enter Name" className="register__input" required />
            <input type="text" id="gender" name="gender" placeholder="Enter Gender" className="register__input" required />
            <input type="email" id="email" name="email" placeholder="Enter Email" className="register__input" required />
            <input type="number" id="Phone Number" name="Phone No" placeholder="Enter Phone Number" className="register__input" required/>
            <input type="password" id="password" name="password" placeholder="Enter Password" className="register__input" minLength="6" required />
            <input type="password" id="Confirm password" name="Confirm password" placeholder="Confirm Password" className="register__input" minLength="6" required />
            <button type="submit" className="Register__btn">Create Account</button>
          </form>
          <p>Already have an account?<b><Link to="/login">Login here!</Link></b></p>
        </div>
      </div>
    </div>
  );
};

export default Register;