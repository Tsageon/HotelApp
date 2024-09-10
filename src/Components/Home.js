import Img from "./mt.png";
import React from 'react';
import './Home.css'
import group37 from "../Components/Group37.png";

const Home = () => {
  return (
    <div className="home">
      <div><img className="home_logo" src={Img} alt="Logo" /></div>
      <h2>The Matrix Hotel</h2>
      <div className="home_text">It's Time To Leave Your Troubles To Us for a while and thanks you for trusting us.
      </div>
      <button className="book-now"><img className="book-icon" src={group37} alt='icon' />Book Now</button>
      </div>
  );
};

export default Home