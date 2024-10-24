import { createSlice } from "@reduxjs/toolkit";
import {
  getDocs,
  getDoc,
  collection,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  where,
  query,
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
  },
});

export const {
  setLoading,
  setData,
  setUser,
  setError,
  setSuccess,
  setFavorites,
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
  addFavorite
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


export const getFavorites = (uid) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const globalFavorites = await fetchGlobalFavorites();

    const userFavorites = await fetchUserFavorites(uid);

    const combinedFavorites = [...globalFavorites, ...userFavorites];

    dispatch(setFavorites(combinedFavorites));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const toggleFavorite = (roomId) => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const state = getState();
    const user = state.db.user; 

    if (!user) {
      dispatch(setError("User not logged in"));
      return;
    }

    const { uid } = user;

    try {
      const favoriteDocRef = doc(db, "Users", uid, "favorites", roomId);

      const favoriteSnapshot = await getDoc(favoriteDocRef);
      if (favoriteSnapshot.exists()) {
   
        await deleteDoc(favoriteDocRef);
        dispatch(removeFavorite({ roomId })); 
      } else {
       
        await setDoc(favoriteDocRef, { roomId });
        dispatch(addFavorite({ roomId })); 
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
      dispatch(setError("Failed to update favorite"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const fetchGlobalFavorites = async () => {
  const globalQuerySnapshot = await getDocs(collection(db, "favorites"));
  return globalQuerySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


const fetchUserFavorites = async (uid) => {
  const userQuerySnapshot = await getDocs(
    collection(db, "Users", uid, "favorites")
  );
  return userQuerySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchFavorites = (uid) => async (dispatch) => {
  dispatch(setLoading());

  try {

    const favoritesCollection = collection(db, 'Users', uid, 'favorites');
    const snapshot = await getDocs(favoritesCollection);
  
    const favorites = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    });

  
    const roomDetailsPromises = favorites.map(async (favorite) => {
      try {
          const roomDocRef = doc(db, 'Rooms', favorite.roomId);
          const roomDoc = await getDoc(roomDocRef);
          if (roomDoc.exists()) {
              return { id: roomDoc.id, ...roomDoc.data() }; 
          } else {
              console.log(`Room not found for ID: ${favorite.roomId}`);
              return null; 
          }
      } catch (error) {
          console.error("Error fetching room details:", error);
          return null; 
      }
  });
  

    const roomDetails = await Promise.all(roomDetailsPromises);
    console.log("Room Details Fetched:", roomDetails);
    const validRoomDetails = roomDetails.filter((room) => room); 

   
    const favoritesWithRoomDetails = favorites.map(favorite => {
      const roomDetail = validRoomDetails.find(room => room.id === favorite.roomId);
      return {
        ...favorite,
        roomDetail, 
      };
  
    });

    console.log("Fetched User Favorites with Room Details:", favoritesWithRoomDetails);
    dispatch(setFavorites(favoritesWithRoomDetails));
  } catch (error) {
    dispatch(setError(error.message));
    console.error("Error fetching favorites:", error);
    return null;
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

export const getUserBookings = (userId, userEmail) => async (dispatch) => {
  dispatch(setLoading());

  try {
    let userBookings = [];

    if (userId) {
      const userIdQuery = query(
        collection(db, "bookings"),
        where("userId", "==", userId)
      );
      const userIdSnapshot = await getDocs(userIdQuery);
      userBookings = userIdSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    if (userBookings.length === 0 && userEmail) {
      const userEmailQuery = query(
        collection(db, "bookings"),
        where("userEmail", "==", userEmail)
      );
      const userEmailSnapshot = await getDocs(userEmailQuery);
      userBookings = userEmailSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    if (userBookings.length === 0) {
      console.warn("No bookings found for this user.");
    }

    dispatch(setBookings(userBookings));
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    dispatch(setError(error.message));
  }
};

export const getAllBookings = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookingsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(setBookings(bookingsData));
  } catch (error) {
    dispatch(setError(error.message));
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