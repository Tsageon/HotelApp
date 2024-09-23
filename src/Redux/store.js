import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dbReducer from './dbSlice';
import roomReducer from './roomSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  db: dbReducer,
  room: roomReducer,
});

export const store = configureStore({
  reducer: rootReducer, 
});
