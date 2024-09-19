import "./Login.css";
import React,{useState} from 'react';
import Img from "./mt.png";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../Redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");  

  const dispatch = useDispatch();

  const handleLogin = (event) => {
    dispatch(signIn(email, Password))
    
    event.preventDefault(); 
    if (Password === "000012") { 
      navigate("/admin");       
    } else {
      navigate("/home");           
    }};

  return (
    <div className="login">
      <div className="login__page">
        <div><img className="login__logo" src={Img} alt="Logo" /></div>
        <div className="login__content">
          <h2><b>Login</b></h2> 
          <p>Welcome Back</p>
          <form Submit={handleLogin}><input type="email" id="email"  value={email} name="email" placeholder="Enter Email" className="login__input"  onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" id="password"   value={Password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter Password" className="login__input" minLength="6" required />
            <p className="login__forgot-txt"><b><i><Link to="/forgotpassword">Forgot Password?</Link></i></b></p>
            <button type="submit" className="login__btn" onClick={handleLogin}>Login</button>
          </form>
          <p>Don't have an account?<b><Link to="/">Register here!</Link></b></p>
        </div>
      </div>
    </div>
  );
};

export default Login;