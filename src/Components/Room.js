import { toast } from 'react-toastify'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData} from "../Redux/dbSlice";
import { listenForAuthChanges } from "../Redux/authSlice";
import { handleFavoriteThunk } from '../Redux/dbSlice';
import { useNavigate, Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import {
  BsFillPeopleFill,
  BsHeart,
  BsHeartFill,
  BsShare,
} from "react-icons/bs";
import Img from "./mt.png";
import "./Room.css";

const Room = () => {
  const [favorites] = useState(new Set());
  const [activeItem, setActiveItem] = useState("");
  const { user, data, loading, error } = useSelector((state) => state.db);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const toggleShareIcons = (roomId) => {
    setVisibleIconsRoomId(prevRoomId => (prevRoomId === roomId ? null : roomId));
  };
  const [visibleIconsRoomId, setVisibleIconsRoomId] = useState(null);


  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = dispatch(listenForAuthChanges());

    return () => {
        if (unsubscribe) {
            unsubscribe(); 
        }
    };
}, [dispatch]);


  useEffect(() => {
    if (!user || !user.uid) {
      alert("Please log in to access the rooms.");
      navigate("/home");
    }
  }, [user, navigate]);

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };
  
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

  const handleFavorite = (roomId) => {
    dispatch(handleFavoriteThunk(roomId, navigate, toast)); 
  };

  const handleShare = (room) => {
    const { roomName, descriptions, price, image } = room;
  
    const encodedRoomName = encodeURIComponent(roomName);
    const encodedDescription = encodeURIComponent(descriptions);
    const encodedPrice = encodeURIComponent(`Price: R${price}`);
    const encodedImage = encodeURIComponent(image); 
  
    const shareUrl = `http://localhost:3000/room/${room.id}`; 
  
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedRoomName} - ${encodedDescription} - ${encodedImage} - ${encodedPrice}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedRoomName} - ${encodedImage} - ${encodedDescription} - ${encodedPrice}&url=${shareUrl}`,
      whatsapp: `https://wa.me/?text=${encodedRoomName} - ${encodedImage} - ${encodedDescription} - ${encodedPrice} ${shareUrl}`,
      instagram: `https://www.instagram.com/`,
      telegram: `https://telegram.me/share/url?url=${shareUrl}&text=${encodedRoomName} - ${encodedDescription} - ${encodedImage} - ${encodedPrice}`,
    };
  };

  const rooms = Array.isArray(data) && data.length > 0 ? data : [];

  return (
    <div>
    <div className="nav-container">
      <div>
        <img src={Img} alt="mage" className="Logo" />
      </div>
      <ul>
        {["Home", "Room", "Amenities", "Contact", "Profile"].map((item) => (
          <li
            key={item}
            className={activeItem === item ? "active" : ""}
            onClick={() => handleMenuClick(item)}
          >
            <Link to={`/${item.toLowerCase()}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  
    <div className="rooms">
      <h2 className="room-title">Available Rooms & Suites</h2>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>Please log in to see your room bookings.</p>
      )}
      <div className="room-sum">
        <p className="description">
          Indulge in the perfect blend of elegance and comfort with our
          beautifully appointed rooms and luxurious suites. Whether you're
          seeking a cozy retreat for two or a spacious suite for the whole
          family, we have accommodations to suit every need. Each room is
          thoughtfully designed with plush bedding, modern amenities, and
          breathtaking views.
        </p><br/>
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
                        toggleShareIcons(room.id);
                      }}
                    >
                      <BsShare className="share-icon" />
                    </span>
                  </h6>

                
                  {visibleIconsRoomId === room.id && (
                    <div className="social-icons">
                     <a href={handleShare(room).facebook} target="_blank" rel="noopener noreferrer" className="icon facebook">
  <FaFacebook className="room-display-share-icon" />
</a>
<a href={handleShare(room).twitter} target="_blank" rel="noopener noreferrer" className="icon twitter">
  <FaXTwitter className="room-display-share-icon" />
</a>
<a href={handleShare(room).whatsapp} target="_blank" rel="noopener noreferrer" className="icon whatsapp">
  <FaWhatsapp className="room-display-share-icon" />
</a>
<a href={handleShare(room).instagram} target="_blank" rel="noopener noreferrer" className="icon instagram">
  <FaInstagram className="room-display-share-icon" />
</a>
<a href={handleShare(room).telegram} target="_blank" rel="noopener noreferrer" className="icon telegram">
  <FaTelegram className="room-display-share-icon" />
</a>
                    </div>
                  )}
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
                <p>
                  {(room.descriptions || "No description available.")
                    .split(".")
                    .slice(0, 1)
                    .join(".")}
                  .
                </p>
  
                <p className="price">Price: R{room.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Room;