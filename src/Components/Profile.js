import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../Redux/dbSlice';
import { db, auth } from '../Config/Fire';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const hasUserData = React.useRef(false);

  const userExists = async (email) => {
    const usersCollection = collection(db, "Users");
    const usersQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(usersQuery);
    return !querySnapshot.empty;
  };

  const addUserData = useCallback(async () => {
    if (!user || hasUserData.current) return;

    const userExistsInDb = await userExists(user.email);
    if (userExistsInDb) {
      console.log("User already exists.");
      hasUserData.current = true;
      return;
    }

    try {
      const userData = {
        name: user.name || 'KingRandy',
        email: user.email,
      };
      await addDoc(collection(db, "Users"), userData);
      console.log('User added successfully');
      hasUserData.current = true;
    } catch (error) {
      console.error('Error adding user data: ', error);
    }
  }, [user]); 

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      const usersQuery = query(
        collection(db, 'Users'),
        where('email', '==', user.email)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        dispatch(setUser({ name: userData.name, email: userData.email }));
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }, [user, dispatch]); // Wrap the function in useCallback and add 'user' and 'dispatch' as dependencies

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const handleUserData = async () => {
      await addUserData();
      await fetchUserData();
    };

    if (user && user.email) {
      handleUserData();
    }
  }, [user, addUserData, fetchUserData]); 

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