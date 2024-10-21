import React, { useState, useEffect } from 'react';
import './Profile.css'
import Img from "./mt.png";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { getDoc, getDocs, query, where, doc, collection, } from "firebase/firestore";
import { db } from "../Config/Fire";
import { handleFavoriteThunk } from '../Redux/dbSlice';
import { logout } from '../Redux/authSlice';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [activeItem, setActiveItem] = useState("");
  const [loading, setLoading] = useState();
  const [favorites, setFavorites] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [bookings, setBookings] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const email = user ? user.email : 'N/A';

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  const formatDate = (date) => {
    if (!date || !date.toDate) return "Invalid Date";
    const parsedDate = date.toDate();
    return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
  };

  useEffect(() => {
    if (user && user.uid) {
      dispatch(handleFavoriteThunk(user.uid));
    }
  }, [user, dispatch]);
  

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (favorites.length > 0) {
        try {
          const roomsCollection = collection(db, "Rooms");
          const roomDetailsPromises = favorites.map((roomId) =>
            getDoc(doc(roomsCollection, roomId))
          );
          const roomDocs = await Promise.all(roomDetailsPromises);
          const roomsData = roomDocs.map((doc) => (doc.exists() ? { id: doc.id, ...doc.data() } : null));
          setRoomDetails(roomsData.filter(room => room !== null));
        } catch (error) {
          console.error("Error fetching room details:", error);
          setError("Failed to load room details.");
        }
      }
    };

    fetchRoomDetails();
  }, [favorites]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user && user.email) {
        const bookingsCollection = collection(db, "bookings");

        try {

          const q = query(bookingsCollection, where("userEmail", "==", user.email));
          const querySnapshot = await getDocs(q);


          const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setBookings(userBookings);
        } catch (error) {
          console.error("Error fetching user bookings:", error);
          setError("Failed to load your bookings.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserBookings();
  }, [user]);



  const handleLogout = () => {
    alert("Logging you out...")
    dispatch(logout());
    navigate("/login");
  };

  console.log('User state:', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (

    <div>
      <div className="nav-container">
        <div>
          <img src={Img} alt="mage" className="Logo" />
        </div>
        <ul>
          <li
            className={activeItem === 'Home' ? 'active' : ''}
            onClick={() => handleMenuClick('Home')}
          ><Link to="/home">Home</Link>
          </li>
          <li
            className={activeItem === 'Rooms' ? 'active' : ''}
            onClick={() => handleMenuClick('Rooms')}
          ><Link to="/room">Rooms</Link>

          </li>
          <li
            className={activeItem === 'Amenities' ? 'active' : ''}
            onClick={() => handleMenuClick('Amenities')}
          ><Link to="/amenities">Amenities</Link>
          </li>
          <li
            className={activeItem === 'Contact' ? 'active' : ''}
            onClick={() => handleMenuClick('Contact')}
          ><Link to="/contact">Contact Us</Link>

          </li>
          <li
            className={activeItem === 'Profile' ? 'active' : ''}
            onClick={() => handleMenuClick('Profile')}
          ><Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>

      <div className="profile">
        <h2>Profile</h2>
        {user ? (
          <div>
            <p>Email: {email}</p>
          </div>
        ) : (
          <div>Please log in to view your profile.</div>
        )}

        <div className="favorite-rooms">
          <h3>Your Favorite Rooms</h3>
          {loading ? (
            <p>Loading your favorites...</p>
          ) : error ? (
            <p>{error}</p>
          ) : roomDetails.length > 0 ? (
            <ul>
              {roomDetails.map((room) => (
                <li key={room.id}>
                  <img className="room-img" src={room.image} alt="room" />
                  <h4>{room.roomName}</h4>
                  <p>{(room.descriptions).split(".")
                    .slice(0, 1)
                    .join(".")}</p>
                  <p>Price: R{room.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No favorite rooms added yet.</p>
          )}
        </div>
        <div className="bookings">
          <h2>Your Bookings</h2>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <p>Room: {booking.roomName}</p>
                <p>Price: R{booking.price}</p>
                <p>Guests: {booking.guests} clients</p>
                <p>Check-in: {formatDate(booking.startDate)}</p>
                <p>Check-out:{formatDate(booking.endDate)}</p>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div><br/>
        <button className='Logout-bt' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;