import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDocs,

  doc,

  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
 
} from "firebase/firestore";
import { db,auth } from "../Config/Fire";


const initialState = {
  data: [],
  roomDetails: [],
  favorites: [],
  bookings: [],
  success: false,
  loading: false,
  error: null,
  user: null,
  name: "",
  email: "",
  password: "",
  clientsReviews : []  ,
  likedRooms :[],
  userBookings :[]

};

export const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
  
    setSuccess(state){
      state.success = true;
      state.loading = false;
    },
    setUser: (state, action) => {
      const { uid, name, email, role } = action.payload;
      state.user = { uid, name, email };
      state.role = role || "user";
      state.isAdmin = role === "admin";
      state.loading = false;
      console.log("Setting user in Redux:", action.payload);
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
    },
    setData(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },  
    addFavorite(state, action) {
      const isFavorite = state.favorites.some((fav) => fav.roomId === action.payload.roomId);
      if (!isFavorite) {
        state.favorites.push({ roomId: action.payload.roomId });
      }
    },
    addFavoriteToState(state, action) {
      const newFavorite = {
        ...action.payload,
        createdAt: action.payload.createdAt ? action.payload.createdAt.toDate().toISOString() : null,
      };
      state.favorites.push(newFavorite);
      state.loading = false;
    },
    setFavorites(state, action) {
      state.favorites = action.payload.map(fav => ({
        ...fav,
        createdAt: fav.createdAt ? fav.createdAt.toDate().toISOString() : null, 
      }));
      state.loading = false;
    },
      removeFavorite(state, action) {
      state.favorites = state.favorites.filter((fav) => fav.roomId !== action.payload.roomId);
    },
    removeFavoriteFromState(state, action) {
      state.favorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
      state.loading = false;
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
    fetchBookings(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    addBookingToState(state, action) {
      state.bookings.push(action.payload);
    },

    setBookings(state, action) {
      state.bookings = action.payload.map(booking => ({
        ...booking,
        startDate: booking.startDate ? booking.startDate.toDate().toISOString() : null,
        endDate: booking.endDate ? booking.endDate.toDate().toISOString() : null,
      }));
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

    setReviews (state, action){
      state.clientsReviews =action.payload

    },

    setLikeRooms (state, action){
      state.likedRooms =action.payload

    },
    setLikedRooms: (state, action) => {
      state.likedRooms = action.payload;
      state.loading = false;
    },

    setUserBooking  (state , action){
      state.userBooking = action.payload;
    }
  },
});

export const {
  setLoading,
  setUserBooking,
  setData,
  setUser,
  setError,
  setSuccess,
  setFavorites,
  setLikedRooms,
  removeFavoriteFromState,
  removeFavorite,
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
  clearUser,
  setUserReviewStatus,
  addFavoriteToState,
  addFavorite ,
  setReviews ,
  setLikeRooms
 
} = dbSlice.actions;

export default dbSlice.reducer;

export const selectRooms = (state) => state.db.data;
export const selectUser = (state) => state.db;


export const listenForAuthChanges = () => {
  return (dispatch) => {
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
          if (user) {
              dispatch(setUser({ uid: user.uid, email: user.email }));
              const userDocRef = doc(db, "Users", user.uid);

              const unsubscribeUserDoc = onSnapshot(userDocRef, (doc) => {
                  if (doc.exists()) {
                      const userData = doc.data();
                      dispatch(setFavorites(Array.isArray(userData.favorites) ? userData.favorites : Array.from(new Set(userData.favorites || []))));
                  }
              });

              return () => unsubscribeUserDoc();
          } else {
              dispatch(setUser(null));
          }
      });

      return () => unsubscribeAuth();
  };
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
    dispatch(fetchRoomsFailure("Failed to fetch rooms: " + error.message));
    console.error("Error fetching documents from Firebase:", error);
  }
};

export const userLikedRooms = (likedData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const likedRoomsRef = collection(db, "users", auth.currentUser.uid, "userLikeRooms");
    const querySnapshot = await getDocs(likedRoomsRef);
    const alreadyLiked = querySnapshot.docs.some(doc => doc.data().roomId === likedData.roomId);

    if (alreadyLiked) {
      alert("You've already liked this room.");
    } else {
      const docRef = await addDoc(likedRoomsRef, {
        ...likedData,
      });
      console.log("Liked Data:", likedData);
      dispatch(setLikeRooms({ id: docRef.id, ...likedData }));
      alert("Liked successfully");
    }
  } catch (error) {
    dispatch(setError("Failed to add Like: " + error.message));
  }
};

export const fetchUserLikedRooms = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const likedRoomsRef = collection(db, "users", auth.currentUser.uid, "userLikeRooms");
    const querySnapshot = await getDocs(likedRoomsRef);
    
    const likedRoomsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(setLikedRooms(likedRoomsData));
  } catch (error) {
    dispatch(setError("Failed to fetch liked rooms: " + error.message));
  }
};


export const fetchReviews = () => async (dispatch) => {
  dispatch(setLoading());
 
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

    dispatch(setReviews(data));
  } catch (error) {
    dispatch(fetchReviewsFailure("Failed to fetch reviews: " + error.message));
    console.error("Error fetching documents from Firebase:", error);
  }
};

export const addReview = (reviewData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    
    await addDoc(collection(db, "Reviews"), {
      name: reviewData.name,    
      email: reviewData.email,   
      review: reviewData.review,
      rating: reviewData.rating, 
    });

    dispatch(setSuccess()); 
  } catch (error) {
    dispatch(setError("Failed to add review: " + error.message));
    console.error("Error adding review to Firebase: ", error);
  }
};

export const addBookings = (bookingData, userId) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      userId,
    });
    console.log("Booking Data:", bookingData);
    dispatch(addBookingToState({ id: docRef.id, ...bookingData, userId }));
  } catch (error) {
    dispatch(setError("Failed to add booking: " + error.message));
  }
};

export const getBookings = (uid) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const querySnapshot = await getDocs(collection(db, uid, "bookings"));
    const bookingsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(setBookings(bookingsData));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (transactionId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const bookingRef = doc(db, "bookings", transactionId);
      await deleteDoc(bookingRef);
      dispatch(setLoading(false));
      console.log("Booking deleted successfully");
      return transactionId;
    } catch (error) {
      dispatch(setError("Error deleting booking: " + error.message));
      dispatch(setLoading(false));
      throw error;
    }
  }
);


export const fetchBookings = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const bookingsCollection = collection(db, "bookings");
    const bookingsSnapshot = await getDocs(bookingsCollection);
    
    const bookingsData = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const uniqueBookings = Array.from(new Map(bookingsData.map(item => [item.transactionId, item])).values());

    dispatch(setBookings(uniqueBookings));
  } catch (error) {
    dispatch(setError("Error fetching data: " + error.message));
  } finally {
    dispatch(setLoading(false)); 
  }
};

export const fetchRooms = () => async (dispatch) => {
  dispatch(fetchRoomsStart());
  try {
    const roomsCollection = collection(db, "Rooms");
    const roomSnapshot = await getDocs(roomsCollection);
    const roomList = roomSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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


export const userBookings = (bookingData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const bookingsRef = collection(db, "users", auth.currentUser.uid, "bookings");
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
    });

    dispatch(setLikeRooms({ id: docRef.id, ...bookingData }));
    alert("Booked successfully");
  } catch (error) {
    dispatch(setError("Failed to book: " + error.message));
  }
};



// export const fetchUserBookings = (profileEmail) => async (dispatch) => {
//   dispatch(setLoading());
//   try {
//     const authEmail = auth.currentUser?.email;

//     let querySnapshot = await getDocs(query(collection(db, "bookings"), where("userEmail", "==", authEmail)));
//     let emailUsed = authEmail;

 
//     if (querySnapshot.empty && profileEmail) {
//       console.log("No bookings found with auth email, trying profile email as fallback.");
      
//       querySnapshot = await getDocs(query(collection(db, "bookings"), where("userEmail", "==", profileEmail)));
//       emailUsed = profileEmail;
//     }

//     if (querySnapshot.empty) {
//       console.log("No bookings found for both auth and profile emails.");
//       alert("No bookings found for your account. Please ensure you're logged in with the correct email and profile information.");
//       dispatch(setBookings([]));
//       return;
//     }

//     const bookingsData = querySnapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         endDate: data.endDate ? new Date(data.endDate) : null,
//         createdAt: data.createdAt ? new Date(data.createdAt) : null,
//       };
//     });

//     console.log("Fetched Bookings:", bookingsData);

   
//     alert(`Bookings successfully retrieved using email: ${emailUsed}`);
    
//     dispatch(setBookings(bookingsData));
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     dispatch(setError("Error fetching bookings: " + error.message));
//   }
// };


export const fetchUserBookings = () => async (dispatch) => {
  //dispatch(fetchRoomsStart());
  try {
    const roomsCollection = collection(db, "users", auth.currentUser.uid, "userBookings");
    const roomSnapshot = await getDocs(roomsCollection);
    const roomList = roomSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(roomList)
   dispatch(setUserBooking(roomList));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to fetch rooms"));
  }
};




