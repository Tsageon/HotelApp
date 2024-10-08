import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { fetchData, setUser } from "../Redux/dbSlice";
import { db } from '../Config/Fire';
import { updateDoc, doc,onSnapshot,} from 'firebase/firestore';
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
  const { user,data, loading, error } = useSelector((state) => state.db);
  console.log("User object in Room component:", user); 
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

  useEffect(() => {
    dispatch(fetchData());
    if (user && user.uid) { 
      const userDocRef = doc(db, 'Users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.favorites) {
            setFavorites(new Set(userData.favorites));
          }
        }
      });
      return () => unsubscribe();
    }
  }, [dispatch, user]);
  
  
  const handleFavorite = async (roomId) => {
    console.log("User object:", user);
    console.log("Favorite button clicked for roomId:", roomId);
    
    if (!user || !user.uid) {
      toast.error('You need to be logged in to add favorites.');
      return;
    }

    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
  
      if (newFavorites.has(roomId)) {
        newFavorites.delete(roomId); 
      } else {
        newFavorites.add(roomId); 
      }
  
      const updatedFavorites = Array.from(newFavorites); 
      console.log("Updated favorites:", updatedFavorites);
      
      const userDocRef = doc(db, 'Users', user.uid); 

      return updateDoc(userDocRef, { favorites: updatedFavorites })
        .then(() => {
          console.log("Favorites updated successfully.");
        
          dispatch(setUser({ ...user, favorites: updatedFavorites }));
          return updatedFavorites;
        })
        .catch((error) => {
          console.error("Error updating favorites:", error);
          return prevFavorites;
        });
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
        {user ? (
        <p>Welcome,{user.email}!</p>
      ) : (
        <p>Please log in to see your room bookings.</p>)}
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
          if (user) { 
            handleFavorite(room.id);
          } else {
            alert('You need to be logged in to add favorites.'); 
          }
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