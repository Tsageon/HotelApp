import { createSlice } from '@reduxjs/toolkit';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Config/Fire';

const initialState = {
  data: [],     
  loading: false, 
  error: null,
  user: null,   
  bookings: [], 
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
      state.user = action.payload;
      state.name = action.payload.name;
      state.email = action.payload.email;
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
  addBookingToState,
  setBookings,
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  addRoomSuccess,
  deleteRoomSuccess,
  updateRoomSuccess,
  setUser,
  clearUser
} = dbSlice.actions;

export default dbSlice.reducer;

export const selectRooms = (state) => state.db.data; 
export const selectUser = (state) => state.db;

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
