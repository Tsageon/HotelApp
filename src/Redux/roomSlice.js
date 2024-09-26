import { createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Config/Fire"; 

const initialState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    fetchRoomsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess(state, action) {
      state.rooms = action.payload;
      state.loading = false;
    },
    fetchRoomsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addRoomSuccess(state, action) {
      state.rooms.push(action.payload);
    },
    deleteRoomSuccess(state, action) {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
    },
    updateRoomSuccess(state, action) {
      const { id, roomName, price } = action.payload;
      const roomIndex = state.rooms.findIndex((room) => room.id === id);
      if (roomIndex !== -1) {
        state.rooms[roomIndex] = { id, roomName, price };
      }
    },
  },
});

export const {
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  addRoomSuccess,
  deleteRoomSuccess,
  updateRoomSuccess,
} = roomSlice.actions;

export const selectRooms = (state) => state.rooms.rooms;


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

export default roomSlice.reducer;