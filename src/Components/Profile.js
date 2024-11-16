import React, { useState, useEffect } from 'react';
import './Profile.css';
import Footer from './footer';
import Nav from './nav'
import { Timestamp } from "firebase/firestore";
import { fetchUserBookings, fetchUserLikedRooms } from '../Redux/dbSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from "react-router-dom";
import { logout, editUserProfile, fetchUserProfile } from '../Redux/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);
  const email = user?.email || 'N/A';
  const { likedRooms = [], loading, error, userBookings = [] } = useSelector((state) => state.db);


  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    username: user?.username || '',
    address: user?.address || '',
    preferences: user?.preferences || [],
    profilePictureFile: null,
  });
  const [imgError, setImgError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : name === 'preferences' ? value.split(',').map(pref => pref.trim()) : value,
    }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const formatDate = (date) => {
    if (!date) return "Invalid Date";
    const parsedDate = date instanceof Timestamp ? date.toDate() : new Date(date);
    return isNaN(parsedDate.getTime()) ? "Invalid Date" : `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
  };

  const LOGOUT = () => {
    alert("Logging you out...");
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = (email) => email.split('@')[0].split(' ').map(word => word.charAt(0)).join('').toUpperCase();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editUserProfile({ uid: user.uid, ...formData }));
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        username: user.username || '',
        address: user.address || '',
        preferences: user.preferences || [],
        profilePictureFile: null,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserProfile(user.uid));
    }
  }, [dispatch, user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserBookings());
      dispatch(fetchUserLikedRooms());
    }
  }, [dispatch, user?.uid]);

  if (authStatus === 'loading') return <p>Loading profile...</p>;
  if (authStatus === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <nav className="nav-container">
       <Nav/>
      </nav>

      <div className="profile">
        <h2>Profile</h2>
        {user ? (
          <div className='profile-content'>
            {!imgError ? (
              <img
                src={user.profilePicture || 'default-profile.png'}
                alt="Profile"
                className="profile-picture"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="profile-initials">{getInitials(email)}</div>
            )}
            <p>{email}</p>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                {['name', 'phone', 'username', 'address'].map((field) => (
                  <div key={field}>
                    <label>{`${field.charAt(0).toUpperCase() + field.slice(1)}:`}</label>
                    <input
                      className="profile-input"
                      type={field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <div>
                  <label>Preferences:</label>
                  <input
                    className="profile-input"
                    type="text"
                    name="preferences"
                    value={formData.preferences.join(', ')}
                    onChange={handleChange}
                    placeholder="Comma-separated values"
                  />
                </div>
                <div>
                  <label>Profile Picture:</label>
                  <input
                    className="profile-input"
                    type="file"
                    name="profilePictureFile"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
              </form>
            ) : (
              <div>
                <p>Name: {user?.name || 'N/A'}</p>
                <p>Phone: {user?.phone || 'N/A'}</p>
                <p>Username: {user?.username || 'N/A'}</p>
                <p>Address: {user?.address || 'N/A'}</p>
                <p>Preferences: {user?.preferences?.join(', ') || 'N/A'}</p>
                <div className="btns">
                  <button onClick={handleEditClick}>Edit Profile</button>
                  <button onClick={LOGOUT}>Logout</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Please log in to view your profile.</div>
        )}
      </div>

      <div className="favorite-rooms">
        <h2>Your Liked Rooms</h2>
        {loading ? (
          <p>Loading liked rooms...</p>
        ) : error ? (
          <p>Error fetching liked rooms: {error}</p>
        ) : likedRooms.length > 0 ? (
          likedRooms.map((room) => (
            <div key={room.id}>
              <img className='Room-img' src={room.image} alt={room.roomName} />
              <p>{room.roomName}</p>
              <p>{room.descriptions}</p>
              <p>R{room.price}</p>
            </div>
          ))
        ) : (
          <p>No liked rooms found.</p>
        )}
      </div>

      <div className='bookings'>
        <h2>Your Bookings</h2>
        {userBookings.length > 0 ? (
          userBookings.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.roomName}</h3>
              <p>Start Date: {formatDate(booking.startDate)}</p>
              <p>End Date: {formatDate(booking.endDate)}</p>
              <p>Price: R{booking.price}</p>
              <img src={booking.image} alt={booking.roomName} />
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;