import React, { useState } from "react";
import "./Footer.css";
import { PiNewspaperClipping } from "react-icons/pi";
import { GiSmartphone } from "react-icons/gi";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { AiOutlineCopyright } from "react-icons/ai";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { CgMail } from "react-icons/cg";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = () => {
    if (email) {
      setMessage("Thanks for subscribing!");
      setEmail("");
    } else {
      setMessage("Enter a valid email.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="footer">
      <div className="border">
        <h4>The Matrix Hotel</h4>
      </div>
      <div className="newsletter">
        <div className="sub">
          <h6>
            Subscribe To Our Newsletter
            <b />
            <PiNewspaperClipping />
          </h6>
        </div>
        <div className="input">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="button">
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
        {message && <p>{message}</p>}
        <br></br>
        <div className="reservation">
          <h6>Reservations</h6>
        </div>
        <div className="phone">
          <GiSmartphone />
          <p>087 310 5230</p>
        </div>
        <div className="phone">
          <TbDeviceLandlinePhone />
          <p>+1-700-897-563</p>
        </div>
        <div className="connect1">
          <h6>Connect With Us</h6>
        </div>
        <div className="icons">
          <a href="mailto:info@matrixhotel.com">
            <CgMail />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX />
          </a>
        </div>
        <br></br>
        <div className="copyright">
          <AiOutlineCopyright />
          <p>2024 The Matrix Hotel</p>
        </div>
        <div className="scroll">
          <button onClick={scrollToTop}>
            <IoIosArrowDropupCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
