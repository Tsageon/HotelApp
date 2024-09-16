import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { GiSmartphone } from "react-icons/gi";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import Footer from "./Footer";
import './Contact.css'


const Contact = () =>{
return( 
    <div className="navbar">
    <div className="border">
      <ul>
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/room">Rooms</a>
        </li>
        <li>
          <a href="/amenities">Amenities</a>
        </li>
        <li>
          <a href="/contact">Contact Us</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
      </ul>
    </div>

<div className="Contact container">
    <h5>Contact Us</h5>
    <p>Visit Us if You are in the Vicinity</p>
    <div className="location"><h5>Details</h5>
    <p>13 CNR TYALA &, Hulana, Galeshewe, Kimberley</p>
    <p>South Africa, Northern Cape</p>
    <p>Sol Plaatjie</p>
    <p>TheMatrixHotel@gmail.com</p></div>
    <div className="connect"><h6>Connect with Us</h6> 
          <a 
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          >
          <FaGoogle/></a> 
          <a href="https://web.telegram.org/"
           target="-blank"
           rel="noopener noreferrer">
            <FaTelegram/>
           </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer">
            <FaLinkedin/>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
         </div>
         <div className="phone1">
          <GiSmartphone />
          <p>087 310 5230</p>
          <TbDeviceLandlinePhone />
          <p>+1-700-897-563</p>
        </div>
         <div className="map iframe"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55982.334372111756!2d24.716628849999996!3d-28.722656949999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9b1aa1ccd1a9fb%3A0xf54c3889b73c614e!2sGaleshewe%2C%20Kimberley%2C%208345!5e0!3m2!1sen!2sza!4v1726468412971!5m2!1sen!2sza" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<div className="message">
    <p>Drop A Message</p>
    <input type="text" id="NaMe"  name="name" placeholder="Name" className="name__input" required /><input type="email" id="Mail"  name="mail" placeholder="Email" className="email__input" required /><br/>
    <input type="message" id="mess"  name="message" placeholder="Message" className="message__input" required /><button className="sub_btn">Submit</button>
</div>
</div>
< Footer/>
</div>

);
};
export default Contact