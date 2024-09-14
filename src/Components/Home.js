import Img from "./mt.png";
import React from "react";
import "./Home.css";
import Amenities from "./Amenities";
import group37 from "../Components/Group37.png";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="home">
        <div>
          <div>
            <img className="home_logo" src={Img} alt="Logo" />
          </div>
        </div>
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
                <a href={Amenities}>Amenities</a>
              </li>
              <li>
                <a href="/contactus">Contact Us</a>
              </li>
              <li>
                <a href="/profile">Profile</a>
              </li>
            </ul>
          </div>
        </div>
        <h2 className="home_h2">The Matrix Hotel</h2>
        <div className="home_text">
          It's Time To Leave Your Troubles To Us for a while
          <br />
          and thank you for trusting us.
        </div>
        <a href="/room">
          <button className="book-now">
            <img className="book-icon" src={group37} alt="icon" />
            Book Now
          </button>
        </a>
      </div>
      <Footer />
    </>
  );
};

export default Home;
