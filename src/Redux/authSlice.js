import { createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../Config/Fire';
import { doc, getDoc } from 'firebase/firestore';

const initialState = {
  user: null,
  role: null,
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
      const { uid, email, role } = action.payload;
      state.user = { uid, email };
      state.role = role;
      state.isAdmin = role === 'admin'; // Set isAdmin based on role
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAdmin = false;
    },
  },
});

export const { setLoading, setUser, setError, logout } = authSlice.actions;

// Fetch the user's role from Firestore
export const fetchUserRole = (uid) => async (dispatch) => {
  try {
    const userDoc = await getDoc(doc(db, 'Users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

// Sign-up function with error handling
export const signUp = ({ email, password, name }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });

    const serializedUser = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || name,
      role: 'user', // Default role for new users
    };

    dispatch(setUser(serializedUser));
  } catch (error) {
    console.error('Error during sign-up:', error);
    dispatch(setError(error.message));
  }
};

// Sign-in function with error handling
export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;

    const role = await dispatch(fetchUserRole(user.uid));

    const serializedUser = {
      uid: user.uid,
      email: user.email,
      role: role || 'user', 
    };

    dispatch(setUser(serializedUser));
  } catch (error) {
    console.error('Error during sign-in:', error);
    dispatch(setError(error.message));
  }
};


export const signOut = () => async (dispatch) => {
  dispatch(logout());
};

export default authSlice.reducer;