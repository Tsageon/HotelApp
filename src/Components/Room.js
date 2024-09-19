import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import "./Room.css";
import { IoIosBed } from "react-icons/io";
import Img from "./mt.png";
import PovertySuite from "../Components/istockphoto-3-1024x1024.jpg";
import istock from "../Components/51.jpg";
import istock2 from "../Components/52.jpg";
import istock3 from "../Components/istockphoto-1342056590-1024x1024.jpg";
import istock4 from "../Components/istockphoto-1452529483-1024x1024.jpg";
import istock5 from "../Components/34.jpg";
import { MdBedroomParent } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import Contact from "./Contact";

const Room = () => {
  const [filter, setFilter] = useState({
    capacity: "all",
    numRooms: "all",
    priceRange: "all",
    numBeds: "all",
    roomType: "all",
  });

  const navigate = useNavigate();

  const [rooms,setRooms] = useState([
    {
      image: PovertySuite,
      name: "Standard Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 1800,
      description:"Step into a sanctuary of serenity in our Standard Suite. Perfect for couples or solo travelers, this cozy haven offers modern comforts and stylish décor. Unwind after a day of exploring in a beautifully appointed space that promises rest and relaxation like never before.",
      booked: false,
    },
    {
      image: istock5,
      name: "Quad Room",
      capacity: "6 people",
      numRooms: "5 rooms",
      numBeds: "4 beds",
      price: 1000,
      description: "Designed for unforgettable group getaways, our Quad Room is the ultimate choice for families or friends traveling together. Spacious, vibrant, and equipped with all the amenities you need, this room offers a balance of comfort and fun, ensuring every moment is filled with joy and connection",
      booked: false,
    },
    {
      image: istock3,
      name: "Penthouse Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 2800,
      description: "Elevate your experience in our exclusive Penthouse Suite, where luxury reaches new heights. With breathtaking views, sophisticated design, and premium amenities, this suite is your personal oasis. Indulge in opulence and let us pamper you in a setting designed for pure indulgence.",
      booked: false,
    },
    {
      image: istock,
      name: "Family Room",
      capacity: "4 people",
      numRooms: "4 rooms",
      numBeds: "3 beds",
      price: 5800,
      description:
        "Create lasting memories in our Family Room, tailored for comfort and convenience. This spacious retreat is perfect for family vacations, offering ample room for everyone to relax and unwind. Whether you're exploring local attractions or enjoying downtime together, this room is your family’s home away from home",
      booked: false,
    },
    {
      image: istock2,
      name: "Royal Suite",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 4800,
      description: "Experience true grandeur in our Royal Suite, where elegance meets comfort. Perfect for guests seeking the finest in hospitality, this suite boasts refined décor, plush bedding, and exclusive amenities. Feel like royalty as you immerse yourself in unparalleled luxury and sophistication.",
      booked: true,
    },
    {
      image: istock4,
      name: "Deluxe Room",
      capacity: "2 people",
      numRooms: "3 rooms",
      numBeds: "2 beds",
      price: 3800,
      description: "Indulge in the perfect blend of style and comfort in our Deluxe Room. Designed for discerning travelers, this room offers a serene escape with exquisite furnishings and thoughtful touches. Treat yourself to a night of lavish rest in a space that embodies the essence of relaxation and tranquility",
      booked: false,
    },
  ]);

  const handleReserve = (index) => {
    const updatedRooms = [...rooms];
    if (!updatedRooms[index].booked) {
      updatedRooms[index].booked = true;
      setRooms(updatedRooms);

      navigate("/reserve", { state: { roomDetails: updatedRooms[index] } });
    } else {
      navigate("/room");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchNumBeds =
      filter.numBeds === "all" || room.numBeds === filter.numBeds;
    const matchCapacity =
      filter.capacity === "all" || room.capacity.includes(filter.capacity);
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
    <div>  <nav className="navbar">
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
      <div className="filter-rooms">
        <ul>
          <li>Filter by:</li>
          
          {/* Capacity filter */}
          <li>
            Capacity:
            <div className="button-group">
              {["all","2","4","6"].map((option) => (
                <button
                  key={option}
                  className={`filter-btn ${filter.capacity === option ? "active" : ""}`}
                  onClick={() => setFilter({ ...filter, capacity: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </li>

          {/* Number of Rooms filter */}
          <li>
            Number of Rooms:
            <div className="button-group">
              {["all", "3", "4", "5"].map((option) => (
                <button
                  key={option}
                  className={`filter-btn ${filter.numRooms === option ? "active" : ""}`}
                  onClick={() => setFilter({ ...filter, numRooms: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </li>

          {/* Room Type filter */}
          <li>
            Room Type:
            <div className="button-group">
              {["all", "Deluxe", "Royal", "Suite", "Room"].map((option) => (
                <button
                  key={option}
                  className={`filter-btn ${filter.roomType === option ? "active" : ""}`}
                  onClick={() => setFilter({ ...filter, roomType: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </li>

          {/* Number of Beds filter */}
          <li>
            Number of Beds:
            <div className="button-group">
              {["all", "2", "4"].map((option) => (
                <button
                  key={option}
                  className={`filter-btn ${filter.numBeds === option ? "active" : ""}`}
                  onClick={() => setFilter({ ...filter, numBeds: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </li>

          {/* Price Range filter */}
          <li>
            Price Range:
            <div className="button-group">
              {["all", "low", "mid", "high"].map((option) => (
                <button
                  key={option}
                  className={`filter-btn ${filter.priceRange === option ? "active" : ""}`}
                  onClick={() => setFilter({ ...filter, priceRange: option })}
                >
                  {option === "low"
                    ? "Standard"
                    : option === "mid"
                    ? "Deluxe"
                    : option === "high"
                    ? "Royal"
                    : "all"}
                </button>
              ))}
            </div>
          </li>
        </ul>
      </div>

      <div className="room-cards">
        {filteredRooms.map((room, index) => (
          <div
            className={`room-card ${room.booked ? "booked" : "available"}`}
            key={index}
          >
            <div className="img-div">
              <img className="room-img" src={room.image} alt="room" />
            </div>
            <div className="room-info">
              <div className="heading">
                <h6>{room.name}</h6>
              </div>
              {room.booked && <span className="booked-label">Booked</span>}
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
              <p>{room.description}</p>
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
        ))}
      </div></div>
      <br />
      <Contact />
      </div> 
  );
};

export default Room;
