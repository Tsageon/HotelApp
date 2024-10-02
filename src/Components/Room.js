import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../Redux/dbSlice";
import { db } from '../Config/Fire';
import { updateDoc, doc} from 'firebase/firestore';
import { useNavigate, Link } from "react-router-dom";
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import {
  BsFillPeopleFill,
  BsHeart,
  BsHeartFill,
  BsShare,
} from "react-icons/bs";
import Img from "./mt.png";
import Contact from "./Contact";
import "./Room.css";

const Room = () => {
  const { data, loading, error } = useSelector((state) => state.db);
  const user = useSelector((state) => state.db.user); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

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

  const handleFavorite = async (roomId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(roomId)) {
        newFavorites.delete(roomId);
      } else {
        newFavorites.add(roomId);
      }

      const updatedFavorites = Array.from(newFavorites);
      const userDocRef = doc(db, 'Users', user.uid);
      updateDoc(userDocRef, { favorites: updatedFavorites });
  
      return newFavorites;
    });
  };
  

  const handleShare = (room) => {
    if (navigator.share) {
      navigator.share({
        title: room.roomName,
        text: `Check this out:${room.roomName}`,
        url: window.location.href, 
      })
        .then(() => {
          console.log('Room shared');
        })
        .catch((error) => {
          console.error('Error sharing room:', error);
        });
    } else {
      alert('Sharing is not supported on this device');
    }
  };
  
  const rooms = Array.isArray(data) && data.length > 0 ? data : [];

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <img className="home_logo" src={Img} alt="Logo" />
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/room">Rooms</Link>
          </li>
          <li>
            <Link to="/amenities">Amenities</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <div className="rooms">
        <h2 className="room-title">Available Rooms & Suites</h2>
        <div className="room-sum">
          <p className="description">
            Indulge in the perfect blend of elegance and comfort with our
            beautifully appointed rooms and luxurious suites. Whether you're
            seeking a cozy retreat for two or a spacious suite for the whole
            family, we have accommodations to suit every need. Each room is
            thoughtfully designed with plush bedding, modern amenities, and
            breathtaking views.
          </p>
        </div>
        <div className="room-cards">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div
                className={`room-card ${room.booked ? "booked" : "available"}`}
                key={index}
                onClick={() => handleReserve(index)}
              >
                <div className="img-div">
                  <img className="room-img" src={room.image} alt="room" />
                </div>
                <div className="room-info">
                  <div className="heading">
                    <h6 className="room-name">
                      {room.roomName}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(room.id);
                        }}
                      >
                        {favorites.has(room.id) ? (
                          <BsHeartFill className="favorite-icon" />
                        ) : (
                          <BsHeart className="favorite-icon" />
                        )}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(room);
                        }}
                      >
                        <BsShare className="share-icon" />
                      </span>
                    </h6>
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
                  <p>{room.descriptions.split(".").slice(0, 1).join(".")}.</p>
                  <p className="price">Price: R{room.price}</p>
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