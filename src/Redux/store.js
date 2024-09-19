import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import dbReducer from './dbSlice'


const rootReducer =combineReducers({
auth: authReducer,
db: dbReducer,
})

export const store = configureStore({
  reducer: {  
    reducer:rootReducer
},
})