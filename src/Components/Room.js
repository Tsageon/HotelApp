import React from "react";
import './Room.css'
import PovertySuite from '../Components/istockphoto-5.jpg'
import People from '../People.png'
import Rooms from '../icon _room_.png'
import Bed from '../Bed.png'

const Room = () => {
 return(   
    <div><h1>Available Rooms & Suites</h1>
    <div className="filter-rooms"><ul><li>Filter by:</li>
    <li>Number of Rooms</li>
    <li>Room type</li>
    <li>Price</li>
    <li>Features</li>
    <li>Capacity</li>
    </ul></div>
<div className="rooms">
<div className="room-img"><img className="room-img" src={PovertySuite} alt="room"/></div>
      <div className="room-info">
        <h3>Poverty Suite</h3>
        <div className="people-icon"><img className="people-icon" src={People} alt='icon'/><p>3 people</p></div>
        <div className="rooms-icon"><img className="rooms-icon" src={Rooms} alt="Yeah"/><p>4 rooms</p></div>
        <div className="beds-icon"><img className="beds-icon" src={Bed} alt="Ah"/><p>3 beds</p></div>
        <p>The Ultimate Middle-class Experience</p>
        <p>Price:<b/>R1800</p>
        <div className="room-btn"><button className="room-btn">Reserve</button></div>
      </div>
      </div></div>
  );
};
export default Room