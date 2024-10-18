import React, {  useState} from 'react';
import './Profile.css'
import { useSelector,useDispatch } from 'react-redux';
import {  logout } from '../Redux/authSlice';
import {  useNavigate } from 'react-router';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error,setError] = useState();
  const [loading,setLoading] = useState();
  const user = useSelector((state) => state.auth.user);
  const email = user ? user.email : 'N/A';
  const displayName = user ? user.displayName : 'N/A'; 
  const role = user ? user.role : 'N/A';


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
    <div className="profile">
      <h2>Profile</h2>
      {user ? (
      <div>
      <p>Your UID: {user ? user.uid : 'N/A'}</p>
      <p>Email: {email}</p>
      <p>Name: {displayName}</p> 
      <p>Role: {role}</p>
          <button className='Logout-bt' onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>Please log in to view your profile.</div>
      )}
    </div>
  );
};

export default Profile;