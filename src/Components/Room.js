import React from "react";
import './Room.css';
import { FaSearch } from "react-icons/fa";
import PovertySuite from '../Components/istockphoto-3-1024x1024.jpg';
import istock from '../Components/51.jpg';
import istock2 from '../Components/52.jpg';
import istock3 from '../Components/istockphoto-1342056590-1024x1024.jpg';
import istock4 from '../Components/istockphoto-1452529483-1024x1024.jpg';
import People from '../People.png';
import Rooms from '../icon _room_.png';
import Bed from '../Bed.png';

const Room = () => {
  const rooms = [
    {
      image: PovertySuite,
      name: "Standard Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: "R1800",
      description:
        "Our cozy Standard Room offers the perfect retreat after a long day.",
    },
    {
      image: istock3,
      name: "Penthouse Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: "R2800",
      description:
        "Elevate your stay in our luxurious Penthouse Suite.",
    },
    {
      image: istock,
      name: "Family Room",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: "R5800",
      description:
        "Designed for families, this spacious room offers",
    },
    {
      image: istock2,
      name: "Royal Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: "R4800",
      description:
        "Indulge in ultimate comfort in our Suite, featuring."},
    {
      image: istock4,
      name: "Deluxe Room",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: "R3800",
      description:
        "Experience a touch of luxury in our Deluxe Room.",
    },
  ];

  return (
    <div className="rooms">
      <h1>Available Rooms & Suites</h1>
      <div className="search">
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
      <div className="filter-rooms">
        <ul>
          <li>Filter by:</li>
          <li>Number of Rooms</li>
          <li>Room type</li>
          <li>Price</li>
          <li>Features</li>
          <li>Capacity</li>
        </ul>
      </div>
      <div className="room-cards">
        {rooms.map((room, index) => (
          <div className="room-card" key={index}>
            <div className="img-div">
              <img className="room-img" src={room.image} alt="room" />
            </div>
            <div className="room-info">
              <h7>{room.name}</h7>
              <div className="icon-group">
                <div className="icon">
                  <img className="icon" src={People} alt="capacity" />
                  <p className="text">{room.capacity}</p>
                </div>
                <div className="icon">
                  <img className="icon" src={Rooms} alt="rooms" />
                  <p className="text">{room.numRooms}</p>
                </div>
                <div className="icon">
                  <img className="icon" src={Bed} alt="beds" />
                  <p className="text">{room.numBeds}</p>
                </div>
              </div>
              <p><span id="dots">{room.description}...</span><span id="more"></span></p>
              <p className="text">Price: {room.price}</p>
              <button className="room-btn">Reserve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
