import React from 'react';
import './AboutUs.css';
import Nav from './nav'
import Gym from './images/gym.jpg'
import Room from './images/room.jpg'
import WIfI from './images/freewifi.jpg'
import Service from './images/service.jpg'
import Conference from './images/conference.jpg'
import Pool from './images/Pool.jpg'
import Bar from './images/bar.jpg'
import Footer from './footer';


const amenities = [
    {
      name: 'Luxurious Rooms and Suites',
      image: Room 
    },
    {
      name: 'On-site Restaurant and Bar',
      image: Bar
    },
    {
      name: 'Swimming Pool and Spa',
      image: Pool
    },
    {
      name: 'Fitness Center',
      image: Gym 
    },
    {
      name: 'Complimentary Wi-Fi',
      image: WIfI 
    },
    {
      name: '24/7 Room Service',
      image: Service
    },
    {
      name: 'Conference and Event Facilities',
      image: Conference 
    }
  ];


const AboutUs = () => {


  return (
<div><Nav />
    <div className="about-us">
        
    <h1>About Us</h1>
    <p>
      Welcome to TheMatrixHotel, where luxury meets comfort. Located in the heart of Kimberley, our hotel offers a serene escape for all travelers. With over a year of experience in hospitality, we pride ourselves on delivering exceptional service and unforgettable experiences.
    </p>
    <h2>Our Mission</h2>
    <p>
      At TheMatrixHotel, our mission is to provide a welcoming atmosphere that allows guests to relax and rejuvenate. We are committed to ensuring your stay is enjoyable and memorable, with attention to detail and personalized service.
    </p>
    <h2>Our Amenities</h2>
    <div className="Amenities-list">
      {amenities.map((amenity, index) => (
        <div className="Amenity-card" key={index}>
          <img src={amenity.image} alt={amenity.name} />
          <p>{amenity.name}</p>
        </div>
      ))}
    </div>
    <h2>Contact Us</h2>
    <p>
      For inquiries or to make a reservation, feel free to reach out to us at:
    </p>
    <p>
      <strong>Email:</strong> info@TheMatrixHotel.co.za<br />
      <strong>Phone:</strong> +27 234 567 8901
    </p>
    <h2>Visit Us</h2>
    <p>
      Come and experience the elegance of TheMatrixHotel. We look forward to welcoming you soon!
    </p>
  </div>
  <Footer/>
  </div>
);
};
 

export default AboutUs;