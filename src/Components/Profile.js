import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../Redux/userSlice'; 
import { db } from '../Config/Fire'; 
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const fetchUserData = async () => {
    try {
      const usersSnapshot = await db.collection('Users').get();
      if (!usersSnapshot.empty) {
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          dispatch(setUser({ name: userData.name, email: userData.email }));
        });
      } else {
        console.log("No users found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
  
  
  useEffect(() => {
    fetchUserData();
    console.log(user); 
  }, [dispatch]);

  if (!user || !user.name || !user.email) {
    return <p>Loading user data...</p>; 
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <h6>Your Favourite Rooms</h6>
      <h6>Your Bookings:</h6>
      {/*User's bookings here*/}
    </div>
  );
};

export default Profile;