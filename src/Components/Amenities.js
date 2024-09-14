import React from "react";
import "./Amenities.css";
import Pool from "./istockphoto-1208302982-1024x1024.jpg";
import Gym from "./istockphoto-515238274-1024x1024.jpg";
import Game from "./istockphoto-1354760356-1024x1024.jpg";
import Spa from "./istockphoto-1590247969-1024x1024.jpg";
import Staff from "./istockphoto-1448294355-1024x1024.jpg";
import Buffet from "./istockphoto-1654917381-1024x1024 (1).jpg";
import Infirmary from "./istockphoto-2160702236-1024x1024.jpg";
import WiFi from "./istockphoto-1498729744-1024x1024.jpg";
import Footer from "./Footer";

const Amenities = () => {
  return (
    <>
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
          <h6>Game Rooms</h6>
          <img src={Game} alt="game room" />
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
          <h6>Infirmary</h6>
          <img src={Infirmary} alt="infirmary" />
        </div>

        <div className="amenity-item">
          <h6>Free WiFi</h6>
          <img src={WiFi} alt="wifi" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Amenities;
