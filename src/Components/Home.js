import Img from "./mt.png";
import React from "react";
import "./Home.css";
import group37 from "../Components/Group37.png";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="home">
      <div className="home" style={{ backgroundImage: `url(https://media.istockphoto.com/id/903417402/photo/luxury-construction-hotel-with-swimming-pool-at-sunset.jpg?s=2048x2048&w=is&k=20&c=fTWeu7OGRhaG6yFf2yv0ZyWADOgdp2x8hgiZd5M-hPs=)` }}/>
        <div className="navbar">
          <div className="border"> 
            <img className="home_logo" src={Img} alt="Logo" />
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