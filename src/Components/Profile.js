import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../Redux/dbSlice'; 
import { db, auth } from '../Config/Fire'; 
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser({ uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName }));
      }
    });

    return () => unsubscribe(); 
  }, [dispatch]);

  const hasUserData = React.useRef(false); 

  const addUserData = async () => {
    if (!user || hasUserData.current) return; 

    try {
      const userData = {
        name: user.name || 'KIngRandy',  
        email: user.email,
      };

      await addDoc(collection(db, 'Users'), userData);
      console.log('User added successfully');
      hasUserData.current = true; 
    } catch (error) {
      console.error('Error adding user data: ', error);
    }
  };

  const fetchUserData = async () => {
    if (!user) return; 
    try {
      const usersSnapshot = await getDocs(collection(db, 'Users')); 
      if (!usersSnapshot.empty) {
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === user.email) {
            dispatch(setUser({ name: userData.name, email: userData.email }));
          }
        });
      } else {
        console.log('No users found');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    const handleUserData = async () => {
      await addUserData();  
      await fetchUserData();
    };

    if (user && user.email) {
      handleUserData();  
    }
  }, [dispatch, user]);

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
      {/* User's bookings or other data */}
    </div>
  );
};

export default Profile;
