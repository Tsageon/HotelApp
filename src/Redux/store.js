import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dbReducer from './dbSlice';
import roomReducer from './roomSlice'
import userReducer from './userSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  db: dbReducer,
  rooms: roomReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer, 
});
