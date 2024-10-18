import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchData, setUser } from "../Redux/dbSlice";
import { db } from "../Config/Fire";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { auth } from "../Config/Fire";
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
import "./Room.css";

const Room = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [activeItem, setActiveItem] = useState("Home");
  const { user, data, loading, error } = useSelector((state) => state.db);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
        const userDocRef = doc(db, "Users", user.uid);

        const unsubscribeUserDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setFavorites(new Set(userData.favorites || []));
          }
        });

        return () => unsubscribeUserDoc();
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribeAuth();
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

  const handleFavorite = async (roomId) => {
    if (!user || !user.uid) {
      toast.error("You need to be logged in to add favorites.");
      navigate("/login");
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

      const userDocRef = doc(db, "Users", user.uid);

      updateDoc(userDocRef, { favorites: updatedFavorites })
        .then(() => {
          dispatch(setUser({ ...user, favorites: updatedFavorites }));
        })
        .catch((error) => {
          console.error("Error updating favorites:", error);
        });

      return newFavorites;
    });
  };

  const handleShare = (room) => {
    if (navigator.share) {
      navigator.share({
        title: room.roomName,
        text: `Check this out: ${room.roomName}`,
        url: window.location.href,
      })
        .then(() => {
          console.log("Room shared");
        })
        .catch((error) => {
          console.error("Error sharing room:", error);
        });
    } else {
      alert("Sharing is not supported on this device");
    }
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