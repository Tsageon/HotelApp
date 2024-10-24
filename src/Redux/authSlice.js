import { createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth, db } from '../Config/Fire';
import { doc, getDoc,setDoc } from 'firebase/firestore';

const initialState = {
  uid:null,
  user: null,
  isAdmin: false,
  role: 'user', 
  loading: false,
  error: null,
  passwordResetSuccess: false, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    }, 
    
    setUserReviewStatus: (state, action) => {
    state.hasLeftReview = action.payload;
    },
    setUser(state, action) {
      const {uid, email, role,} = action.payload;
      console.log('Setting user in Redux:', action.payload);
      state.user = {uid, email};
      state.name = action.payload.name; 
      state.role = role || 'user'; 
      state.isAdmin = role === 'admin'; 
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  
    clearUser: (state) => {
      state.name = "";
      state.email = "";
    },
    logout(state) {
      state.user = null;
      state.role = 'user'; 
      state.isAdmin = false;
      state.loading = false;
      state.error = null;
      state.passwordResetSuccess = false;
    },
  },
});


export const { setLoading ,setUser, setError, logout, setPasswordResetSuccess,setUserReviewStatus } = authSlice.actions;



const addUserToFirestore = async (uid, email, name, role) => {
  try {
    const userRef = doc(db, 'Users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {

      await setDoc(userRef, {
        email,
        name, 
        role,
      
      });
      console.log('User added to Firestore:', { uid, email, role });
    } else {
      console.log('User already exists in Firestore:', { uid, email });
    }
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};


export const signUp = ({ email, password, name }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;
  
    await updateProfile(user, { displayName: name });

    await addUserToFirestore(user.uid, email,name, 'user');

    const serializedUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || name,
      role: 'user', 
    };
    console.log('Serialized user:', serializedUser);

    dispatch(setUser(serializedUser));
  } catch (error) {
    console.error('Error during sign-up:', error);
    dispatch(setError(error.message));
  }
};


export const fetchUserRole = (uid) => async (dispatch) => {
  try {
    const userDoc = await getDoc(doc(db, 'Users', uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User data from Firestore:', userData);

      const role = userData.role || 'user'; 
      const email = userData.email|| null; 
      dispatch(setUser({ uid, email, role })); 
      console.log(`Fetched role: ${role} for UID: ${uid}`);
      return role; 
    }

    dispatch(setUser({ uid, email: null, role: 'user' }));
    console.log(`No user document found, defaulting to user role for UID: ${uid}`);
    return 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    dispatch(setError(error.message));
    dispatch(setUser({ uid, email: null, role: 'user' })); 
    return 'user';
  }
};


export const signIn = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;

    const role = await dispatch(fetchUserRole(user.uid));
    
    const isAdmin = role === 'admin' || email === "kb@gmail.com"; 

    const serializedUser = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role:'user',
      isAdmin,
    };

    console.log('Serialized user:', serializedUser);
    
    dispatch(setUser(serializedUser)); 

    return isAdmin; 
  } catch (error) {
    console.error('Error during sign-in:', error);
    dispatch(setError(error.message));
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await firebaseSignOut(auth);
    dispatch(logout());
  } catch (error) {
    console.error('Error during sign-out:', error);
    dispatch(setError(error.message));
  }
};

export const resetPassword = ({ email }) => async (dispatch) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Email Sent")
    dispatch(setUser());
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
  }
};



export default authSlice.reducer;