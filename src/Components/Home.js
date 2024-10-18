import Img from "./mt.png";
import React, { useState } from "react";
import Reviews from "./reviews";
import Footer from './footer'
import Gallery from "./Gallery";
import "./Home.css";
import "./Room.css";
import Amenities from "./Amenities";
import { Link } from "react-router-dom"; 


const Home = () => {

  const [activeItem, setActiveItem] = useState('Home'); 
  const handleMenuClick = (item) => {
    setActiveItem(item); 
  }

  return (
    <>

<div className="nav-container">
      <div>
      <img src={Img} alt="mage" className="Logo"/>
      </div>
      <ul>
        <li
          className={activeItem === 'Home' ? 'active' : ''}
          onClick={() => handleMenuClick('Home')}
        ><Link to="/home">Home</Link> 
        </li>
        <li
          className={activeItem === 'Rooms' ? 'active' : ''}
          onClick={() => handleMenuClick('Rooms')}
        ><Link to="/room">Rooms</Link>
        
        </li>
        <li
          className={activeItem === 'Amenities' ? 'active' : ''}
          onClick={() => handleMenuClick('Amenities')}
        ><Link to="/amenities">Amenities</Link>
        </li>
        <li
          className={activeItem === 'Contact' ? 'active' : ''}
          onClick={() => handleMenuClick('Contact')}
        ><Link to="/contact">Contact Us</Link>
          
        </li>
        <li
          className={activeItem === 'Profile' ? 'active' : ''}
          onClick={() => handleMenuClick('Profile')}
        ><Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>

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
      <Gallery/>
      <Reviews />
        <Footer/>
    </>
  );
};

export default Home;