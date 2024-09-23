import { createSlice } from "@reduxjs/toolkit";

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
    addRoom(state, action) {
      state.rooms.push({
        id: state.rooms.length + 1,
        ...action.payload,
      });
    },
    deleteRoom(state, action) {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
    },
    updateRoom(state, action) {
      const { id, roomName, price } = action.payload;
      const roomIndex = state.rooms.findIndex((room) => room.id === id);
      if (roomIndex !== -1) {
        state.rooms[roomIndex] = {
          ...state.rooms[roomIndex],
          roomName,
          price,
        };
      }
    },
  },
});

export const {
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  addRoom,
  deleteRoom,
  updateRoom,
} = roomSlice.actions;

export const selectRooms = (state) => state.rooms.rooms;

export const fetchRooms = () => async (dispatch) => {
  dispatch(fetchRoomsStart());
  try {
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve([{ id: 1, roomName: "Deluxe Suite", price: 5000 }]), 1000)
    );
    dispatch(fetchRoomsSuccess(response));
  } catch (error) {
    dispatch(fetchRoomsFailure("Failed to fetch rooms"));
  }
};

export default roomSlice.reducer;
