import React, { useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {addReview} from '../Redux/dbSlice';
import { AiOutlineCopyright } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { SiGmail } from "react-icons/si";
import "./footer.css";
import Logo from "./mt.png";
import RatingReview from "./star";

const Footer = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [nameInput, setNameInput] = useState('');

  const user = useSelector((state) => state.auth.user);
  console.log("Current user:", user);

  const db = useSelector((state) => state.db);
  console.log("DB instance:", db);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch((addReview));
    console.log(addReview)
  }, [dispatch]); 
  
  return (
    <div>
      <div className="Footer">
        <h5>LesMaTrix</h5>
        <div className="LOcation">
          <img className="footer-logo" src={Logo} alt="Logo" />
          <p>13 CNR TYALA &, Hulana, Galeshewe, Kimberley</p>
          <p>South Africa, Northern Cape</p>
          <p>Sol Plaatjie</p>
        </div>

        <div className="review-content">
          <h4>Leave a Review</h4>
          <input
        placeholder="Your Name"
        value={user?.name || nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
          <input
            placeholder="LoginIN"
            value={user?.email || "KingRandy"}
            disabled
          />
          <input
            className="INput-2"
            placeholder="Review here"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <RatingReview
            className="RAting"
            rating={rating}
            setRating={setRating}
          />
          <br />
          <button className="Send-button" onClick={addReview}>
            Send
          </button>
        </div>

        <div className="Details">
          <h6 className="Details-heading">Get in touch with us</h6>
          <p>087 310 5230</p>
          <p>TheMatrixHotel@gmail.com</p>
          <div>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGmail className="footer-icon" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="footer-icon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiTwitterXFill className="footer-icon" />
            </a>
          </div>
        </div>

        <div className="map iframe">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55982.334372111756!2d24.716628849999996!3d-28.722656949999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9b1aa1ccd1a9fb%3A0xf54c3889b73c614e!2sGaleshewe%2C%20Kimberley%2C%208345!5e0!3m2!1sen!2sza!4v1726468412971!5m2!1sen!2sza"
            width="600"
            height="450"
            allowFullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="CoPyright">
        <AiOutlineCopyright className="COP-icon" />
        <p>2024 The Matrix Hotel</p>
      </div>
    </div>
  );
};

export default Footer;