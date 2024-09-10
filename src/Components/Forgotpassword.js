import "./Forgotpassword.css";
import Img from "./mt.png";
import { Link } from 'react-router-dom';
import React from 'react';


const Forgotpassword = () => {
  return (
    <div className="Forgot">
      <div><img className="forgotpassword__logo" src={Img} alt="Logo" /></div>
      <div className="forgotpassword__page">
        <div className="forgotpassword__content">
          <h2><b>Forgot Your Password</b></h2>
          <p>Enter the email address associated with your account</p>
          <form><input type="email" id="email" name="email" placeholder="Enter Email" className="forgotpassword__input" required />
            <input type="password" id="password" name="Old password" placeholder="Enter Old Password" className="forgotpassword__input" minLength="6" required />
            <input type="password" id="New password" name="New password" placeholder="Enter New Password" className="forgotpassword__input" minLength="6" required />
            <button type="submit" className="forgotpassword__btn">Change Password</button>
          </form>
          <p>Remember your password? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;