import { createSlice } from '@reduxjs/toolkit';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '../Config/Fire';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
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
      state.data.push(action.payload);
      state.loading = false; 
    },
  },
});

export const { setLoading, setData, setError, addBookingToState } = dbSlice.actions;

export default dbSlice.reducer;

export const fetchData = () => async (dispatch) => {
  dispatch(setLoading());

  try {
    const querySnapshot = await getDocs(collection(db, "Rooms"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      console.log('Warning: No documents found in the "Rooms" collection!');
    }
    dispatch(setData(data));
  } catch (error) {
    dispatch(setError('Failed to fetch rooms: ' + error.message));
    console.error('Error fetching documents from Firebase:', error);
  }
};

export const addBookings = (bookingData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    console.log("Document written with ID: ", docRef.id);
    dispatch(addBookingToState({ id: docRef.id, ...bookingData }));
  } catch (error) {
    dispatch(setError('Failed to add booking: ' + error.message));
    console.error('Error adding booking to Firebase:', error);
  }};