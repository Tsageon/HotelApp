import "./Register.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "./Alerts";
import Img from "./mt.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signUp } from "../Redux/authSlice";
import { Bars } from "react-loader-spinner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [gender, setgender] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphonenumber] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const { user, loading, error } = useSelector((state) => state.auth || {});
  
  const showAlert = useAlert();
  const dispatch = useDispatch();

  const handleSignUp = () => {
    dispatch(signUp({ email, password, name }));
  };

  useEffect(() => {
    if (user) {
      showAlert("success","Signup successful");
      navigate("/home");
    }
  }, [user, navigate,showAlert]);

  return (
    <div className="register">
      <div className="register__page">
        <div>
          <img className="register__logo" src={Img} alt="Logo" />
        </div>
        <div className="Register__content">
          <h2>
            <b>Register</b>
          </h2>
          <p>Please enter the required details to Create an account</p>

          <input
            onChange={(e) => {
              setname(e.target.value);
            }}
            type="text"
            id="text"
            name="name"
            value={name}
            placeholder="Enter Name"
            className="register__input"
            required
          />
          <input
            onChange={(e) => {
              setgender(e.target.value);
            }}
            type="text"
            id="gender"
            name="gender"
            value={gender}
            placeholder="Enter Gender"
            className="register__input"
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Enter Email"
            className="register__input"
            required
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
          <input
            value={phoneNumber}
            type="number"
            id="Phone Number"
            name="Phone No"
            placeholder="Enter Phone Number"
            className="register__input"
            required
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
          />
          <input
            value={password}
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            className="register__input"
            minLength="6"
            required
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          <input
            value={confirmpassword}
            type="password"
            id="Confirm password"
            name="Confirm password"
            placeholder="Confirm Password"
            className="register__input"
            minLength="6"
            required
            onChange={(e) => {
              setconfirmpassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="Register__btn"
            onClick={handleSignUp}
          >
            Create Account
          </button>

          {loading && (
            <div className="register__loader">
              <Bars
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )}

          {error && <p className="register__error">Error: {error}</p>}

          <p>
            <br />
            Already have an account?
            <b>
              <Link to="/login">Login here!</Link>
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
