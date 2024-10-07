import "./Forgotpassword.css";
import Img from "./mt.png";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from '../Config/Fire';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent successfully!');
    } catch (error) {
      console.error("Error resetting password: ", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Forgot">
      <div><img className="forgotpassword__logo" src={Img} alt="Logo" /></div>
      <div className="forgotpassword__page">
        <div className="forgotpassword__content">
          <h2><b>Forgot Your Password</b></h2>
          <p>Enter the email address associated with your account to reset your password</p>

          {message && <p className="forgotpassword__success">{message}</p>}
          {error && <p className="forgotpassword__error">{error}</p>}

          <form onSubmit={handlePasswordReset}>
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
            <button type="submit" className="forgotpassword__btn" disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          <p>Remember your password? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;