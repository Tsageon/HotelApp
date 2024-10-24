import React, { useState, useEffect } from 'react';
import './Profile.css'
import Img from "./mt.png";
import { getUserBookings,fetchFavorites} from '../Redux/dbSlice'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { logout } from '../Redux/authSlice';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");

  const user = useSelector((state) => state.auth.user);
  const email = user ? user.email : 'N/A';
  const uid = user ? user.uid :null;
  const {bookings,loading,error} = useSelector((state)=> state.db);
  const favorites = useSelector((state) => state.db.favorites);

 
  
  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  
  const LOGOUT = () => {
      alert("Logging you out...")
      dispatch(logout());
      navigate("/login");
  }

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFavorites(user.uid));
      dispatch(getUserBookings(user.uid, user.email)); 
    }
  }, [dispatch, user]);
  
  
  console.log('User state:', user);

  const formatDate = (date) => {
    if (date && date.toDate) {
      return date.toDate().toLocaleString(); 
    } else {
      return ''; 
    }
  };

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
  ) : Array.isArray(favorites) && favorites.length > 0 ? ( 
    <ul>
      {favorites.map((room) => (
        <li key={room.id}>
          <img className="room-img" src={room.image} alt={`${room.roomName}mage`} />
          <h4>{room.roomName}</h4>
          <p>{room.descriptions}</p>
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
            <p>Check-out: {formatDate(booking.endDate)}</p>
            <p>Created At: {formatDate(booking.createdAt)}</p> 
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>

        <br/>
        <button className='Logout-bt' onClick={LOGOUT} >Logout</button>
      </div>
    
    </div>

  );
};

export default Profile;