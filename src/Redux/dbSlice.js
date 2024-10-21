import { createSlice } from '@reduxjs/toolkit';
import { getDocs,getDoc, collection, addDoc,setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Config/Fire';

const initialState = {
  data: [],     
  loading: false, 
  error: null,
  user: null,   
  bookings: [],
  success: false, 
  name: '', 
  email: '', 
  password:'',   
};

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      const { uid, name, email, role } = action.payload; 
      state.user = { uid, name, email }; 
      state.role = role || 'user';     
      state.isAdmin = role === 'admin';  
      state.loading = false;            
      console.log('Setting user in Redux:', action.payload);
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
    },
    setData(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },   
    updateFavoritesSuccess: (state, action) => {
      state.loading = false;
      state.success = true; 
    },
    updateFavoritesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    fetchReviewsStart(state) {
      state.loading = true;
      state.error = null;
    },
fetchReviewsSuccess(state, action) {
  state.data = action.payload; 
  state.loading = false;
},
fetchReviewsFailure(state, action) {
  state.error = action.payload; 
  state.loading = false;
},
addReviewSuccess: (state, action) => {
  state.reviews.push(action.payload); 
  state.loading = false;
  state.error = null;
},
    fetchBookings(state){
      state.loading = true;
      state.error = null;
    },  
    fetchBookingsSuccess(state,action)
    {
      state.data = action.payload;
      state.loading = false;
    },
    addBookingToState(state, action) {
      state.bookings.push(action.payload);
    },
    setBookings(state, action) {
      state.bookings = action.payload; 
    }, 
  
    fetchRoomsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchRoomsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addRoomSuccess(state, action) {
      state.data.push(action.payload);
    },
    deleteRoomSuccess(state, action) {
      state.data = state.data.filter((room) => room.id !== action.payload);
    },
    updateRoomSuccess(state, action) {
      const { id, roomName, price } = action.payload;
      const roomIndex = state.data.findIndex((room) => room.id === id);
      if (roomIndex !== -1) {
        state.data[roomIndex] = { id, roomName, price };
      }
    },
  },
});


export const {
  setLoading,
  setData,
  setError,
  updateFavoritesFailure,
  updateFavoritesSuccess,
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  addReviewSuccess,
  addBookingToState,
  setBookings,
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  addRoomSuccess,
  deleteRoomSuccess,
  updateRoomSuccess,
  setUser,
  clearUser,
  setUserReviewStatus
} = dbSlice.actions;

export default dbSlice.reducer;

export const selectRooms = (state) => state.db.data; 
export const selectUser = (state) => state.db;


export const handleFavoriteThunk = (roomId, navigate, toast) => async (dispatch, getState) => {
  const { user } = getState().auth; 

  if (!user || !user.uid) {
    toast.error("You need to be logged in to add favorites.");
    return navigate("/login");
  }

  const userDocRef = doc(db, "Users", user.uid);
  
  try {
    const userDoc = await getDoc(userDocRef);
    let currentFavorites = [];

    if (userDoc.exists()) {
      currentFavorites = userDoc.data().favorites || [];
    } else {
      await setDoc(userDocRef, { favorites: [] });
      console.log("User document created");
    }

    const newFavorites = new Set(currentFavorites);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
    } else {
      newFavorites.add(roomId);
    }

    const updatedFavorites = Array.from(newFavorites);

    await updateDoc(userDocRef, { favorites: updatedFavorites });
    dispatch(updateFavoritesSuccess());
     
    dispatch(setUser({ ...user, favorites: updatedFavorites }));
   
    
    alert("Favorites updated successfully!");

  } catch (error) {
    console.error("Error updating favorites:", error);
    alert("Failed to update favorites. Please try again.");
  }
};


export const fetchData = () => async (dispatch) => {
  dispatch(fetchRoomsStart());

  try {
    const querySnapshot = await getDocs(collection(db, "Rooms"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      console.log('Warning: No documents found in the "Rooms" collection!');
    }
    dispatch(fetchRoomsSuccess(data));
  } catch (error) {
    dispatch(fetchRoomsFailure('Failed to fetch rooms: ' + error.message));
    console.error('Error fetching documents from Firebase:', error);
  }
};

export const fetchReviews = () => async (dispatch) => {
  dispatch(fetchReviewsStart()); 
  console.log("Fetching reviews...");

  try {
    const querySnapshot = await getDocs(collection(db, "Reviews"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched Reviews Data:", data);

    if (data.length === 0) {
      console.log('Warning: No documents found in the "Reviews" collection!');
    }

    dispatch(fetchReviewsSuccess(data)); 
  } catch (error) {
    dispatch(fetchReviewsFailure('Failed to fetch reviews: ' + error.message)); // Dispatch failure action
    console.error('Error fetching documents from Firebase:', error);
  }
};

export const addReview = (reviewData) => async (dispatch) => {
  dispatch(setLoading()); 
  console.log("Adding review:", reviewData);

  try {

    const docRef = await addDoc(collection(db, "Reviews"), reviewData);
    console.log('docRef:', docRef);
    console.log('Review added with ID:', docRef.id);

    dispatch(addReviewSuccess({ id: docRef.id, ...reviewData }));
  } catch (error) {
   
    dispatch(setError('Failed to add review: ' + error.message));
    console.error('Error adding review:', error);
  }
};


export const addBookings = (bookingData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    console.log('Booking Data:', bookingData);
    dispatch(addBookingToState({ id: docRef.id, ...bookingData }));
  } catch (error) {
    dispatch(setError('Failed to add booking: ' + error.message));
  }
};


export const fetchBookings = () => async (dispatch) => {
  dispatch(setLoading());

  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(setBookings(bookings));
  } catch (error) {
    dispatch(setError('Failed to fetch bookings: ' + error.message));
    console.error('Error fetching bookings from Firebase:', error);
  }
};

export const fetchRooms = () => async (dispatch) => {
  dispatch(fetchRoomsStart());
  try {
    const roomsCollection = collection(db, "Rooms");
    const roomSnapshot = await getDocs(roomsCollection);
    const roomList = roomSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dispatch(fetchRoomsSuccess(roomList));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to fetch rooms"));
  }
};


export const addRoom = (roomData) => async (dispatch) => {
  try {
    const roomsCollection = collection(db, "Rooms");
    const docRef = await addDoc(roomsCollection, roomData);
    dispatch(addRoomSuccess({ id: docRef.id, ...roomData }));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to add room"));
  }
};

export const deleteRoom = (id) => async (dispatch) => {
  try {
    const roomDoc = doc(db, "Rooms", id);
    await deleteDoc(roomDoc);
    dispatch(deleteRoomSuccess(id));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to delete room"));
  }
};

export const updateRoom = (updatedRoom) => async (dispatch) => {
  try {
    const { id, roomName, price } = updatedRoom;
    const roomDoc = doc(db, "Rooms", id);
    await updateDoc(roomDoc, { roomName, price });
    dispatch(updateRoomSuccess(updatedRoom));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to update room"));
  }
};
