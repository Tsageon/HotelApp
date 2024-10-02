import Img from "./mt.png";
import React from "react";
import "./Home.css";
import "./Room.css";
import img from "./istockphoto-3-1024x1024.jpg";
import Amenities from "./Amenities";
import { Link } from "react-router-dom"; 

const Home = () => {
  return (
    <>
      <div className="home">
        <nav className="navbar">
          <ul className="nav-links">
          <img className="home_logo" src={Img} alt="Logo" />
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/room">Rooms</Link></li>
            <li><Link to="/amenities">Amenities</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>

        <div className="home_text">
          <h2 className="home_h2">The Perfect Getaway Starts Here</h2>
          <p>
            Step into a world where relaxation meets refined luxury. Whether you're seeking a peaceful retreat or an adventure-filled escape.
          </p>

          <Link to="/room">
            <button className="book-now">Book Now</button>
          </Link>
        </div>
        <br/>
        <section className="about-section">
          <h2 className="aboutus-header">About Us</h2>
          <div className="about-content">
            <img src={img} alt="aboutus" className="about-img" />
            <div className="aboutus-text">
              <p>
                At The TheMatrixHotel, we believe that every journey deserves an extraordinary destination. Nestled in the heart of Kimberley, our hotel is designed to be the perfect starting point for your dream getaway. 
                From elegantly appointed rooms and suites to gourmet dining and world-class amenities, we ensure that every detail of your stay is thoughtfully taken care of.
              </p>
            </div>
          </div>
        </section>
        <Amenities />
      </div>
    </>
  );
};

export default Home;