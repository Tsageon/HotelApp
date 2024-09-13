import React, { useState } from "react";
import './Room.css';
import { FaSearch } from "react-icons/fa";
import { IoIosBed } from "react-icons/io";
import PovertySuite from '../Components/istockphoto-3-1024x1024.jpg';
import istock from '../Components/51.jpg';
import istock2 from '../Components/52.jpg';
import istock3 from '../Components/istockphoto-1342056590-1024x1024.jpg';
import istock4 from '../Components/istockphoto-1452529483-1024x1024.jpg';
import istock5 from '../Components/34.jpg'
import { MdBedroomParent } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";

const Room = () => {
  const [filter, setFilter] = useState({
    capacity: "all",
    numRooms: "all",
    priceRange: "all",
    numBeds: "all",
    roomType: "all",
  });

  const rooms = [
    {
      image: PovertySuite,
      name: "Standard Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 1800,
      description: "Our cozy Standard Room offers the perfect retreat after a long day.",
    },
    {
      image: istock5,
      name: "Quad Room",
      capacity: "6 people",
      numRooms: "5 rooms",
      numBeds: "4 beds",
      price: 1000,
      description: "Our Quad Room is perfect for groups of friends or family.",
    },
    {
      image: istock3,
      name: "Penthouse Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 2800,
      description: "Elevate your stay in our luxurious Penthouse Suite.",
    }, {
      image: istock,
      name: "Family Room",
      capacity: "4 people",
      numRooms: "4 rooms",
      numBeds: "3 beds",
      price: 5800,
      description: "Designed for families, this spacious room offers ample comfort.",
    }, {
      image: istock2,
      name: "Royal Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 4800,
      description: "Indulge in ultimate comfort in our Suite, featuring.",
    }, {
      image: istock4,
      name: "Deluxe Room",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 3800,
      description: "Experience a touch of luxury in our Deluxe Room.",
    },];

  const filteredRooms = rooms.filter((room) => {
    const matchNumBeds = filter.numBeds === "all" || room.numBeds === filter.numBeds;
    const matchCapacity = filter.capacity === "all" || room.capacity.includes(filter.capacity);
    const matchNumRooms = filter.numRooms === "all" || room.numRooms === filter.numRooms;
    const matchRoomType = filter.roomType === "all" || room.name.toLowerCase().includes(filter.roomType.toLowerCase());


    const matchPrice =
      filter.priceRange === "all" ||
      (filter.priceRange === "low" && room.price < 1000) ||
      (filter.priceRange === "mid" && room.price >= 2000 && room.price <= 5000) ||
      (filter.priceRange === "high" && room.price > 4000);

    return matchRoomType && matchNumBeds && matchCapacity && matchNumRooms && matchPrice;
  });

  return (
    <div className="rooms">
      <h4>Available Rooms & Suites</h4>
      <div className="search">
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
      <div className="filter-rooms">
        <ul>
          <li>Filter by:</li>
          <li> Capacity:
            <select className="options" value={filter.capacity}
              onChange={(e) => setFilter({ ...filter, capacity: e.target.value })}>
              <option value="all">All</option>
              <option value="2 people">2 people</option>
              <option value="4 people">4 people</option>
            </select></li>
          <li> Number of Rooms:
            <select className="options" value={filter.numRooms}
              onChange={(e) => setFilter({ ...filter, numRooms: e.target.value })}>
              <option value="all">All</option>
              <option value="3 rooms">3 rooms</option>
              <option value="4 rooms">4 rooms</option>
            </select></li>
          <li>Room type:
            <select className="options" value={filter.roomType}
              onChange={(e) => setFilter({ ...filter, roomType: e.target.value })}>
              <option value="all">All</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Royal">Royal</option>
              <option value="Suite">Suite</option>
              <option value="Room">Room</option>
            </select></li>
          <li>Number of Beds:
            <select className="options" value={filter.numBeds}
              onChange={(e) => setFilter({ ...filter, numBeds: e.target.value })}>
              <option value="all">All</option>
              <option value="2 beds">2 beds</option>
              <option value="4 beds">4 beds</option>
            </select></li>
          <li>Price Range:
            <select className="options" value={filter.priceRange}
              onChange={(e) => setFilter({ ...filter, priceRange: e.target.value })}>
              <option value="all">All</option>
              <option value="low">Below R3000</option>
              <option value="mid">R3000 - R5000</option>
              <option value="high">Above R5000</option>
            </select></li>
        </ul>
      </div>
      <div className="room-cards">
        {filteredRooms.map((room, index) => (
          <div className="room-card" key={index}>
            <div className="img-div">
              <img className="room-img" src={room.image} alt="room" />
            </div>
            <div className="room-info">
              <h7>{room.name}</h7>
              <div className="icon-group">
                <div className="icon">
                  <BsFillPeopleFill />
                  <p className="text">{room.capacity}</p>
                </div>
                <div className="icon">
                  <MdBedroomParent />
                  <p className="text">{room.numRooms}</p>
                </div>
                <div className="icon">
                  <IoIosBed />
                  <p className="text">{room.numBeds}</p>
                </div>
              </div>
              <p><span id="dots">{room.description}...</span><span id="more"></span></p>
              <p className="text">Price: R{room.price}</p>
              <button className="room-btn">Reserve</button>
            </div></div>
        ))}
      </div></div>
  );
};

export default Room;