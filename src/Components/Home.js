import Img from "./mt.png";
import React from "react";
import "./Home.css";
import "./Room.css";
import img from "../Components/images/istockphoto-3-1024x1024.jpg";
import Amenities from "./Amenities";
import { Link } from "react-router-dom"; 

const Home = () => {
  return (
    <>

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

      <div className="home">
       
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
        
        <Amenities />
      </div>
      

      <section className="about-section" style={{marginTop:"15%"}}>
          <h2 className="aboutus-header">About Us</h2>
          <div className="about-content">
           
            <div className="aboutus-text">
              <p>
              At The Matrix Hotel, we believe that every journey deserves an extraordinary destination, and we are here to offer just that. Nestled in the heart of the historic and vibrant city of Kimberley, our hotel is more than just a place to rest—it's a gateway to unforgettable experiences. Whether you're traveling for business or pleasure, we aim to be the perfect starting point for your dream getaway, where every moment feels special.
Our elegantly appointed rooms and suites offer a harmonious blend of comfort and luxury, thoughtfully designed to cater to your every need. Whether you’re waking up to a stunning sunrise or unwinding after a long day of exploring, our accommodations provide a serene retreat that makes you feel right at home. Indulge in our gourmet dining options, where world-class chefs prepare exquisite meals crafted from the finest local ingredients, promising to delight your palate with every bite.
Beyond the rooms and dining, The Matrix Hotel boasts a range of world-class amenities designed to make your stay exceptional. Whether you’re relaxing by our tranquil pool, rejuvenating at the spa, or exploring the rich cultural history of Kimberley, we ensure that every detail of your stay is thoughtfully taken care of. From the moment you arrive until the day you leave, our dedicated staff is here to provide impeccable service and create memories that last a lifetime. So come, let us be part of your journey, and discover why The Matrix Hotel is more than just a destination—it is where your dreams come to life.
              </p>
            </div>
          </div>
        </section>
    </>
  );
};

export default Home;