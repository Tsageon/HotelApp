import Img from "./mt.png";
import React from "react";
import "./Home.css";
import "./Room.css"
import img from "./istockphoto-3-1024x1024.jpg";
import Amenities from "./Amenities";

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="navbar1">
          <div>
            <img className="home_logo" src={Img} alt="Logo" />
          </div>

          <div>
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

        <div className="home_text">
          <h2 className="home_h2">The Perfect Getaway Starts Here</h2>
          <p>
            {" "}
            Step into a world where relaxation meets refined luxury. Whether
            you're seeking a peaceful retreat or an adventure-filled escape.
          </p>

          <a href="/room">
            <button className="book-now">Book Now</button>
          </a>
        </div>

        <br/><br/>

        <h2 className="aboutus-header">About Us</h2>
        <div className="about-section">
          <div className="">
            <img src={img} alt="aboutus"  className="about-img"/>
          </div>
          <div className="aboutus-text">
            <p>
              At The TheMatrixHotel, we believe that every journey deserves an
              extraordinary destination. Nestled in the heart of Kimberley, our
              hotel is designed to be the perfect starting point for your dream
              getaway. With a blend of modern luxury, impeccable service, and a
              welcoming atmosphere, we strive to make every guest feel at home
              from the moment they step through our doors. Our dedicated team is
              committed to curating memorable experiences tailored to your
              needs, whether you’re here for a peaceful retreat, a romantic
              escape, or a family adventure. From elegantly appointed rooms and
              suites to gourmet dining and world-class amenities, we ensure that
              every detail of your stay is thoughtfully taken care of. At
              TheMatrixHotel, the perfect getaway doesn’t just start—it
              flourishes, creating memories that will last a lifetime. Your
              journey to relaxation and discovery begins with us.
            </p>
          </div>
        </div>
        <Amenities/>
      </div>
    
    </>
  );
};

export default Home;
