import React, { useState, useEffect } from 'react';
import './Profile.css';
import Img from "./mt.png";
import { fetchUserBookings, fetchUserLikedRooms } from '../Redux/dbSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { logout } from '../Redux/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");

  const user = useSelector((state) => state.auth.user);
  const email = user ? user.email : 'N/A';
  const { bookings = [], likedRooms = [], loading, error, userBookings } = useSelector((state) => state.db);

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  const LOGOUT = () => {
    alert("Logging you out...");
    dispatch(logout());
    navigate("/login");
  }

  useEffect(() => {
    dispatch(fetchUserBookings());
    if (user?.uid) {
      console.log("Fetching user liked rooms and bookings for UID:", user.uid);
      dispatch(fetchUserLikedRooms());
   
    } else {
      console.log("No user found. User object:", user);
    }
    
  }, [dispatch, user]);

  console.log("Liked Room IDs:", likedRooms.map(room => room.id));
  console.log('User Bookings:', bookings);
  console.log('User state:', user);

  return (
    <div>
      <div className="nav-container">
        <div>
          <img src={Img} alt="mage" className="Logo" />
        </div>
        <ul>
          <li className={activeItem === 'Home' ? 'active' : ''} onClick={() => handleMenuClick('Home')}>
            <Link to="/home">Home</Link>
          </li>
          <li className={activeItem === 'Rooms' ? 'active' : ''} onClick={() => handleMenuClick('Rooms')}>
            <Link to="/room">Rooms</Link>
          </li>
          <li className={activeItem === 'Amenities' ? 'active' : ''} onClick={() => handleMenuClick('Amenities')}>
            <Link to="/amenities">Amenities</Link>
          </li>
          <li className={activeItem === 'Contact' ? 'active' : ''} onClick={() => handleMenuClick('Contact')}>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className={activeItem === 'Profile' ? 'active' : ''} onClick={() => handleMenuClick('Profile')}>
            <Link to="/profile">Profile</Link>
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
          <h2>Your Liked Rooms</h2>
          {loading ? (
            <p>Loading liked rooms...</p>
          ) : error ? (
            <p>Error fetching liked rooms: {error}</p>
          ) : likedRooms.length > 0 ? (
            likedRooms.map((room) => (
              <div key={room.id}>
                <img className='Profile-img'src={room.image} alt='A'/>
                <p>{room.roomName}</p>
                <p>{room.descriptions}</p>
                <p>R{room.price}</p> 
              </div>
            ))
          ) : (
            <p>No liked rooms found.</p>
          )}
        </div>

        <div className='bookings '>
      {userBookings.length > 0 ? (
      userBookings.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.roomName}</h3>
          <p>Start Date: {booking.startDate ? new Date(booking.startDate).toLocaleString() : "No Date Available"}</p>
          <p>End Date: {booking.endDate ? booking.endDate.toLocaleString() : "No Date Available"}</p>
          <p>Price: {booking.price}</p>
          <img src={booking.image} alt={booking.roomName} />
        </div>
      ))
    ) : (
      <p>No bookings found.</p>
    )}
  </div>


        <br />
        <button className='Logout-bt' onClick={LOGOUT}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
