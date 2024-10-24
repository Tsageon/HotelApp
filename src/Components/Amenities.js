import React from "react";
import "./Amenities.css";
import Pool from "../Components/images/istockphoto-1208302982-1024x1024.jpg";
import Gym from "../Components/images/istockphoto-515238274-1024x1024.jpg";
import Spa from "../Components/images/istockphoto-1590247969-1024x1024.jpg";
import Staff from "../Components/images/istockphoto-1448294355-1024x1024.jpg";
import Buffet from "../Components/images/istockphoto-1654917381-1024x1024 (1).jpg";
import WiFi from "../Components/images/istockphoto-1146115827-1024x1024.jpg";

const Amenities = () => {
  return (
    <div>
      <div className="title">
        <h1>Indulge in Our Premium Amenities</h1>
        <p className="paragraph">At The Matrix Hotel, we believe that comfort and convenience are paramount to an exceptional stay. Our thoughtfully curated amenities cater to your every need, ensuring a relaxing and enjoyable experience. From luxurious accommodations to state-of-the-art facilities, we provide a range of options designed to enhance your visit.</p>
      </div>
      <div className="amenities-container">
        <div className="amenity-item">
          <h6>Spa</h6>
          <a href={Spa} target="-blank" rel="noopener noreferrer">
            <img src={Spa} alt="spa" />
          </a>
        </div>

        <div className="amenity-item">
          <h6>Fully Equipped Gym</h6>
          <a href={Gym} target="-blank" rel="noopener noreferrer">
            <img src={Gym} alt="gym" />
          </a>
        </div>
        <div className="amenity-item">
          <h6>Swimming Pool</h6>
          <a href={Pool} target="-blank" rel="noopener noreferrer">
            <img src={Pool} alt="pool" />
          </a>
        </div>

        <div className="amenity-item">
          <h6>Top Tier Staff</h6>
          <a href={Staff} target="-blank" rel="noopener noreferrer">
            <img src={Staff} alt="staff" />
          </a>
        </div>

        <div className="amenity-item">
          <h6>Complementary Buffet</h6>
          <a href={Buffet} target="-blank" rel="noopener noreferrer">
            <img src={Buffet} alt="buffet" />
          </a>
        </div>

        {/* <div className="amenity-item">
          <h6 className="wifi">Free WiFi</h6>
          <img src={WiFi} alt="wifi" />
        </div> */}

        <div className="amenity-item">
          <h6>Free Wifi</h6>
          <a href={WiFi} target="-blank" rel="noopener noreferrer">
            <img src={WiFi} alt="wifi" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Amenities;