import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../Redux/dbSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import Img from "./mt.png";
import Contact from "./Contact";
import "./Room.css";

const Room = () => {
  const [filter, setFilter] = useState({
    capacity: "all",
    numRooms: "all",
    priceRange: "all",
    numBeds: "all",
    roomType: "all",
  });

  const { data, loading, error } = useSelector((state) => state.db);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  
  console.log('Rooms Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);
  
  const navigate = useNavigate();

 
  const rooms = Array.isArray(data) && data.length > 0 ? data : [];

  const handleReserve = (index) => {
    const selectedRoom = rooms[index];
  
    if (!selectedRoom.booked) {
      const updatedRoom = {
        ...selectedRoom,
        booked: true,
      };
  
      navigate("/reserve", { state: { roomDetails: updatedRoom } });
    } else {
      navigate("/room");
    }
  };
  
  const filteredRooms = rooms.filter((room) => {
    const matchNumBeds =
      filter.numBeds === "all" || room.numBeds === filter.numBeds;
      const matchCapacity =
      filter.capacity === "all" || room.guests === filter.capacity;
    
    const matchNumRooms =
      filter.numRooms === "all" || room.numRooms === filter.numRooms;
    const matchRoomType =
      filter.roomType === "all" ||
      room.name.toLowerCase().includes(filter.roomType.toLowerCase());

    const matchPrice =
      filter.priceRange === "all" ||
      (filter.priceRange === "low" && room.price < 2000) ||
      (filter.priceRange === "mid" && room.price >= 3000 && room.price <= 5000) ||
      (filter.priceRange === "high" && room.price > 5000);

    return (
      matchRoomType &&
      matchNumBeds &&
      matchCapacity &&
      matchNumRooms &&
      matchPrice
    );
  });

  return (
    <div>
      <nav className="navbar">
        <div className="logo-container">
          <img className="home_logo" src={Img} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/room">Rooms</Link></li>
          <li><Link to="/amenities">Amenities</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      <div className="rooms">
        <h6>Available Rooms & Suites</h6>
        {/* Display filtered rooms */}
        <div className="room-cards">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                className={`room-card ${room.booked ? "booked" : "available"}`}
                key={index}
              >
                <div className="img-div">
                  <img className="room-img" src={room.image} alt="room" />
                </div>
                <div className="room-info">
                  <div className="heading">
                    <h6>{room.roomName}</h6>
                  </div>
                  {room.booked && <span className="booked-label">Booked</span>}
                  <div className="icon-group">
                    <div className="icon">
                      <BsFillPeopleFill />
                      <p className="text">{room.guests}</p>
                    </div>
                    <div className="icon">
                      <MdBedroomParent />
                      <p className="text">{room.noofRooms}</p>
                    </div>
                    <div className="icon">
                      <IoIosBed />
                      <p className="text">{room.noofBeds}</p>
                    </div>
                  </div>
                  <p>{room.descriptions}</p>
                  <p className="price">Price: R{room.price}</p>
                  <button
                    onClick={() => handleReserve(index)}
                    className="room-btn"
                    disabled={room.booked}
                  >
                    {room.booked ? "Unavailable" : "Reserve"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms available.</p>
          )}
        </div>
      </div>
      <br />
      <Contact />
    </div>
  );
};

export default Room;
