import React from "react";
import { Link } from "react-router-dom"; 
import "./Amenities.css";
import Pool from "./istockphoto-1208302982-1024x1024.jpg";
import Gym from "./istockphoto-515238274-1024x1024.jpg";
import Spa from "./istockphoto-1590247969-1024x1024.jpg";
import Staff from "./istockphoto-1448294355-1024x1024.jpg";
import Buffet from "./istockphoto-1654917381-1024x1024 (1).jpg";
import Contact from "./Contact";
import WiFi from "./istockphoto-1498729744-1024x1024.jpg";


const Amenities = () => {
  return (
<div>
      <div className="title">
        <h5>Amenities</h5>
      </div>
      <div className="amenities-container">
        <div className="amenity-item">
          <h6>Spa</h6>
          <img src={Spa} alt="spa" />
        </div>

        <div className="amenity-item">
          <h6>Fully Equipped Gym</h6>
          <img src={Gym} alt="gym" />
        </div>
        <div className="amenity-item">
          <h6>Swimming Pool</h6>
          <img src={Pool} alt="pool" />
        </div>

        <div className="amenity-item">
          <h6>Top Tier Staff</h6>
          <img src={Staff} alt="staff" />
        </div>

        <div className="amenity-item">
          <h6>Complementary Buffet</h6>
          <img src={Buffet} alt="buffet" />
        </div>   

        <div className="amenity-item">
          <h6>Free WiFi</h6>
          <img src={WiFi} alt="wifi" />
        </div>
      </div>
   <Contact/>
   </div>
  );
};

export default Amenities; 