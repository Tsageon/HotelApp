import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, listenForAuthChanges, setFavorites, addFavorite, removeFavoriteFromState } from "../Redux/dbSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaTelegram, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import { BsFillPeopleFill, BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import Img from "./mt.png";
import "./Room.css";

const Room = () => {
  const favorites = useSelector((state) => state.db?.favorites || []);
  const { data, loading, error } = useSelector((state) => state.db || { favorites: [] });
  const user = useSelector((state) => state.auth.user);

  const rooms = Array.isArray(data) && data.length > 0 ? data : [];
  const [activeItem, setActiveItem] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibleIconsRoomId, setVisibleIconsRoomId] = useState(null);

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

  const handleShare = (room) => {
    const { roomName, descriptions, price, image } = room;

    const encodedRoomName = encodeURIComponent(roomName);
    const encodedDescription = encodeURIComponent(descriptions);
    const encodedPrice = encodeURIComponent(`Price: R${price}`);
    const shareUrl = `http://localhost:3000/room/${room.id}`;

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedRoomName} - ${encodedDescription} - ${encodedPrice}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedRoomName} - ${encodedDescription} - ${encodedPrice}&url=${shareUrl}`,
      whatsapp: `https://wa.me/?text=${encodedRoomName} - ${encodedDescription} - ${encodedPrice} ${shareUrl}`,
      instagram: `https://www.instagram.com/`,
      telegram: `https://telegram.me/share/url?url=${shareUrl}&text=${encodedRoomName} - ${encodedDescription} - ${encodedPrice}`,
    };
  };

  const handleAddFavorite = (roomId, e) => {
    e.stopPropagation();

    const isFavorite = favorites.some((fav) => fav.roomId === roomId);

    if (isFavorite) {
      dispatch(removeFavoriteFromState(roomId));
    } else {
      dispatch(addFavorite(user.uid || user.email, user.email, roomId));
    }
  };

  return (
    <div>
      

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
                      <span onClick={(e) => handleAddFavorite(room.id, e)}>
                        {favorites.some((favorite) => favorite.id === room.id) ? (
                          <BsHeartFill className="favorite-icon" />
                        ) : (
                          <BsHeart className="favorite-icon" />
                        )}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setVisibleIconsRoomId(prevRoomId => (prevRoomId === room.id ? null : room.id));
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
                          <FaTwitter className="room-display-share-icon" />
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
