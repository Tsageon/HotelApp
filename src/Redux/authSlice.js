import { createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/Fire';  

const ADMIN_EMAIL = 'KB@gmail.com';
const ADMIN_PASSWORD = 'Hoteladministrator';

const initialState = {
  user: null,
  isAdmin: false,  
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload.email === ADMIN_EMAIL; 
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setLoading, setUser, setError, logout } = authSlice.actions;

export const signUp = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    dispatch(setUser(user));
  } catch (error) {
    dispatch(setError(error.message));
  }
};


export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      dispatch(setUser(user)); 
    } else {
      dispatch(setUser(user));  
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const signOut = () => async (dispatch) => {
  dispatch(logout());
};


export default authSlice.reducer;