import "./Forgotpassword.css";
import Img from "./mt.png";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { resetPassword } from '../Redux/authSlice'; 
import { useDispatch, useSelector } from "react-redux"

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message] = useState(null);
 
  const [loading] = useState(false);

 
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handlePasswordReset = async () => {
    dispatch(resetPassword({ email}));
    alert("Link has been sent")
  };

  return (
    <div className="Forgot">
      <div><img className="forgotpassword__logo" src={Img} alt="Logo" /></div>
      <div className="forgotpassword__page">
        <div className="forgotpassword__content">
          <h2><b>Forgot Your Password</b></h2><br/>
          <p>Enter the email address associated with your account to reset your password</p><br/>
          {message && <p className="forgotpassword__success">{message}</p>}
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              className="forgotpassword__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="forgotpassword__btn" disabled={loading} onClick={handlePasswordReset}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
            <br/>
          <p>Remember your password?<i><Link to="/login">Login</Link></i></p>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;