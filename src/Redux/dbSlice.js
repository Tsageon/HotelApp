import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDocs,
  query,
  where,
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../Config/Fire";
import { useAlert } from "../Components/Alerts";



const initialState = {
  data: [],
  favorites: JSON.parse(localStorage.getItem('likedRooms')) || [],
  roomDetails: [],
  bookings: [],
  success: false,
  loading: false,
  error: null,
  userId: auth.currentUser?.uid || null,
  name: "",
  email: "",
  password: "",
  clientsReviews: [],
  likedRooms: [],
  userBookings: []
};

export const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setLoaded: (state) => {
      state.loading = false;
    },
    setSuccess(state) {
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
    setFavorites: (state, action) => {
      console.log('Dispatching favorites:', action.payload);
      state.favorites = action.payload;
    },
    setLikedRooms: (state, action) => {
      state.favorites = action.payload;
      localStorage.setItem('likedRooms', JSON.stringify(state.favorites));
    },
    userLikedRooms: (state, action) => {
      const room = action.payload;
      const isAlreadyFavorited = state.favorites.some(favorite => favorite.roomId === room.roomId);
      if (isAlreadyFavorited) {
        state.favorites = state.favorites.filter(favorite => favorite.roomId !== room.roomId);
      } else {
        state.favorites.push(room);
      }
      localStorage.setItem('likedRooms', JSON.stringify(state.favorites));
    },
    
    removeLikedRoom: (state, action) => {
      const roomId = action.payload;
      state.favorites = state.favorites.filter(room => room.roomId !== roomId);
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
      console.log("Setting bookings to:", action.payload);
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
    setReviews(state, action) {
      state.clientsReviews = action.payload
    },
    setUserBookings(state, action) {
      state.userBookings = action.payload;
    }
  },
});

export const {
  setLoading,
  setLoaded,
  setUserBookings,
  setData,
  setUser,
  setFavorites,
  setError,
  setSuccess,
  setLikedRooms,
  removeLikedRoom,
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
  setReviews,
  setLikeRooms

} = dbSlice.actions;

export default dbSlice.reducer;

export const selectRooms = (state) => state.db.data;
export const selectUser = (state) => state.db;

export const listenForAuthChanges = () => {
  return (dispatch, getState) => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));

        const userDocRef = doc(db, "users", user.uid);

        const unsubscribeUserDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();

            const favorites = Array.isArray(userData?.favorites)
              ? userData.favorites
              : [];

            const currentFavorites = getState()?.user?.favorites || [];


            if (JSON.stringify(favorites) !== JSON.stringify(currentFavorites)) {
              dispatch(setFavorites(favorites));
            }
          } else {
            console.warn("User document does not exist. Resetting favorites.");
            dispatch(setFavorites([]));
          }
        });

        return () => {
          unsubscribeUserDoc();
        };
      } else {
        console.warn("User is not logged in. Resetting user and favorites.");
        dispatch(setUser(null));
        dispatch(setFavorites([]));
      }
    });

    return () => {
      unsubscribeAuth();
    };
  };
};

export const fetchData = () => async (dispatch) => {
  dispatch(fetchRoomsStart());

  try {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "Rooms"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      console.log('Warning: No documents found in the "Rooms" collection!');
    }
    dispatch(fetchRoomsSuccess(data));
    setLoading(false);
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to fetch rooms: " + error.message));
    console.error("Error fetching documents from Firebase:", error);
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  dispatch(setLoading(true));

  if (!auth.currentUser) {
    dispatch(fetchRoomsFailure("User is not authenticated"));
    return;
  }

  try {
    const userEmail = auth.currentUser.email;
    const roomsCollection = collection(db, 'users', auth.currentUser.uid, "userBookings");

    const roomSnapshot = await getDocs(roomsCollection);
    let roomList = roomSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        startDate: data.startDate.toDate().toISOString(),
        endDate: data.endDate.toDate().toISOString(),
      };
    });


    if (roomList.length === 0) {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsQuery = query(bookingsCollection, where('userEmail', '==', userEmail));
      const bookingsSnapshot = await getDocs(bookingsQuery);

      roomList = bookingsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString(),
          startDate: data.startDate.toDate().toISOString(),
          endDate: data.endDate.toDate().toISOString(),
        };
      });
    }

    console.log(roomList);
    dispatch(setUserBookings(roomList));
  } catch (error) {
    console.error("Error fetching user bookings: ", error);
    dispatch(fetchRoomsFailure("Failed to fetch bookings: " + error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const userLikedRooms = (likedData, showAlert) => async (dispatch) => {
  console.log("likedD in userLikedRooms:", likedData);
  dispatch(setLoading());

  const userId = auth.currentUser?.uid;
  if (!userId) {
    showAlert.error("User not authenticated.");
    return;
  }

  if (!likedData || !likedData.roomId) {
    showAlert.error("Invalid room data provided.");
    dispatch(setError("Invalid room data provided."));
    return;
  }

  const localStorageKey = `likedRooms_${userId}`;

  try {
    let likedRooms = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    const likedRoomsRef = collection(db, "users", userId, "userLikeRooms");

    const existingRoom = likedRooms.find((room) => room.roomId === likedData.roomId);

    if (existingRoom) {
      likedRooms = likedRooms.filter((room) => room.roomId !== likedData.roomId);
      localStorage.setItem(localStorageKey, JSON.stringify(likedRooms));
      dispatch(setLikedRooms(likedRooms));
      showAlert.success("Removed from favorites");

      const roomQuery = query(likedRoomsRef, where("roomId", "==", likedData.roomId));
      const querySnapshot = await getDocs(roomQuery);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
      }
    } else {
      likedRooms.push(likedData);
      localStorage.setItem(localStorageKey, JSON.stringify(likedRooms));
      dispatch(setLikedRooms(likedRooms));
      showAlert.success("Liked successfully");

      await addDoc(likedRoomsRef, { ...likedData });
    }
  } catch (error) {
    console.error("Error in userLikedRooms:", error);
    showAlert.error("Failed to toggle like: " + error.message);
    dispatch(setError("Failed to toggle like: " + error.message));
  }
};


export const userBookings = (bookingData) => async (dispatch) => {
  dispatch(setLoading());
  const showAlert = useAlert();
  try {
    const bookingsRef = collection(db, 'users', auth.currentUser.uid, 'userBookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
    });
    dispatch(addBookingToState({ id: docRef.id, ...bookingData }));
    showAlert("success", "Booked successfully");
  } catch (error) {
    dispatch(setError("Failed to book: " + error.message));
    showAlert("error", "Failed to book: " + error.message);
  }
};


export const fetchUserLikedRooms = () => async (dispacth) => {
  dispacth(setLoading(true));

  const userId = auth.currentUser?.uid;
  if (!userId) {
    dispacth(setError("User not authed!"));
    return;
  }
  const localStorageKey = `likedRooms_${userId}`;
  try {
    const likedRooms = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    dispacth(setFavorites)(likedRooms)

    const likedRoomsRef = collection(db, 'users', 'userLikeRooms');
    const querySnapshot = await getDocs(likedRoomsRef);

    const likedRoomsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) || [];
    localStorage.setItem(localStorageKey, JSON.stringify(likedRoomsData));
    dispacth(setLikedRooms(likedRoomsData));
    dispacth(setLoaded(false));
  } catch (error) {
    dispacth(setError("failed to get the things:" + error.message));
  }
};


export const fetchReviews = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const querySnapshot = await getDocs(collection(db, "Reviews"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
    }
    dispatch(setReviews(data));
  } catch (error) {
    dispatch(fetchReviewsFailure("Failed to fetch reviews: " + error.message));
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
  } finally {
    dispatch(setLoading(false));
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
  });

export const selectBookings = (state) => state.db.bookings;

export const fetchBookings = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const bookingsCollection = collection(db, "bookings");
    const bookingsSnapshot = await getDocs(bookingsCollection);

    const bookingsData = bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,

        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
      };
    });

    console.log("Bookings Data:", bookingsData);

    const uniqueBookings = Array.from(new Map(bookingsData.map(item => [item.transactionId, item])).values());

    console.log("Unique Bookings:", uniqueBookings);

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