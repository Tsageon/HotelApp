import { createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { auth } from '../Config/Fire';  

const ADMIN_EMAIL = 'KB@gmail.com';

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
      const { uid, email } = action.payload;
      state.user = { uid, email }; 
      state.isAdmin = email === ADMIN_EMAIL; 
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


export const signUp = ({ email, password, name }) => async (dispatch) => {
  dispatch(setLoading()); 

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

  
    await updateProfile(user, { displayName: name });

   
    const serializedUser = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || name,
    };

    dispatch(setUser(serializedUser)); 
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

   
    const serializedUser = {
      uid: user.uid,
      email: user.email,
    };

    dispatch(setUser(serializedUser));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const signOut = () => async (dispatch) => {
  dispatch(logout());
};

export default authSlice.reducer;
