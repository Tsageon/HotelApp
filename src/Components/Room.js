import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, listenForAuthChanges } from "../Redux/dbSlice";
import { useNavigate } from "react-router-dom";
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import { BsFillPeopleFill, BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import Nav from './nav'
import "./Room.css";

import { userLikedRooms } from "../Redux/dbSlice";

const Room = () => {
  const favorites = useSelector((state) => state.db?.favorites || []);
  const { data, loading, error } = useSelector((state) => state.db || { favorites: [] });
  const user = useSelector((state) => state.auth.user);
  const [isSharing, setIsSharing] = useState(false); 
  const [messageVisible, setMessageVisible] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const rooms = Array.isArray(data) && data.length > 0 ? data : [];
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (rooms.length === 0 && !loading) {
      dispatch(fetchData());
    }
  }, [dispatch, rooms.length, loading]);

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

  const handleShare = async (room) => {
    const { roomName, descriptions, price } = room;

    const shareData = {
      title: roomName,
      text: `${descriptions} - Price: R${price}`,
      url: `http://localhost:3000/room/${room.id}`,
    };

    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share(shareData);
        setShareMessage('Share Successful!');
        setMessageVisible(true);
        setTimeout(() => {
          setMessageVisible(false); 
        }, 3000);
      } catch (error) {
        console.error('Error sharing:', error);
      } finally {
        setIsSharing(false);
      }
    } else {
      console.error('Web Share API is not supported in this browser.');
    }
  };
  
  const handleAddFavorite = (room) => {
   dispatch(userLikedRooms(room));
  };

  return (
    <div>
      <Nav/>

      <div className="rooms">
        <h2 className="room-title">Available Rooms & Suites</h2>
        {user ? (
          <p>Welcome, {user.email}!</p>
        ) : (
          <p>Please log in to see Rooms.</p>
        )}
        <div className="room-sum">
          <p className="description">
            Indulge in the perfect blend of elegance and comfort with our beautifully appointed rooms and luxurious suites. Whether you're seeking a cozy retreat for two or a spacious suite for the whole family, we have accommodations to suit every need. Each room is thoughtfully designed with plush bedding, modern amenities, and breathtaking views.
          </p><br />
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
        handleAddFavorite(room);
      }}>
                        {favorites.some((favorite) => favorite.id === room.id) ? (
                          <BsHeartFill className="favorite-icon" />
                        ) : (
                          <BsHeart className="favorite-icon" />
                        )}
                      </span>
                      <span
        onClick={(e) => {
          e.stopPropagation();
          if (!isSharing) {
            handleShare(room);
          }
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
