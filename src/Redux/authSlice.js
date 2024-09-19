import { createSlice } from "@reduxjs/toolkit";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,} from "firebase/auth";
import { auth } from "../Config/Fire";

const initialState = {
  user: {
    email: "",
    password: "",
  },
  value: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUp: (state, action) => {
      createUserWithEmailAndPassword(auth, action.payload, action.payload)
        .then(() => {
          alert("Registration successfully");
        })

        .catch((err) => {
          console.log(err.message);
        });
    },

    signIn:(state, action) =>{
      signInWithEmailAndPassword(auth, action.payload, action.payload)
      .then(() => {
        alert("Loggedin successfully")})
      
        .catch((err)=>{
          console.log(err.message);
        })
    }
  },
});

// Action creators are generated for each case reducer function
export const { signUp,signIn } = authSlice.actions;

export default authSlice.reducer;
