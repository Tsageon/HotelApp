import { createSlice ,  createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth, db } from '../Config/Fire';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';


const initialState = {
  uid:null,
  user: { name: '',
    phone: '',
    username: '',
    address: '',
     preferences: [] }, 
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user.name = action.payload.name;
      }
    },
    setUserPreferences(state, action) {
      if (state.user) {
        state.user.preferences = action.payload; 
      }
    },    
    setUserReviewStatus(state, action) {
      state.hasLeftReview = action.payload;
    },
    setUser(state, action) {
      const {uid, email, name, role = 'user'} = action.payload; 
      state.user = { uid, email, name: name || '' };
      state.role = role;
      state.isAdmin = role === 'admin';
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.name = "";
      state.email = "";
      state.role = 'user';
      state.isAdmin = false;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload }; 
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


export const { setLoading,setUserPreferences ,setUser, updateUser, setError, logout, setPasswordResetSuccess,setUserReviewStatus } = authSlice.actions;



const addUserToFirestore = async (uid, email, name, role) => {
 
  try {
    const userRef = doc(db, 'users', uid);
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
  dispatch(setLoading(true)); 
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    await addUserToFirestore(user.uid, email, name, 'user');

    const serializedUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || name,
      role: 'user',
    };

    dispatch(setUser(serializedUser));
  } catch (error) {
    console.error('Error during sign-up:', error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false)); 
  }
};



export const fetchUserRole = (uid) => async (dispatch) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));

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
  dispatch(setLoading(true));
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential || !userCredential.user) {
      throw new Error('UserCredential is undefined or null.');
    }

    const user = userCredential.user;
    const role = await dispatch(fetchUserRole(user.uid));
    const isAdmin = role === 'admin' || email === "kb@gmail.com" || email === "sagaetshepo@gmail.com";

    const serializedUser = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role: 'user',
      isAdmin,
    };

    dispatch(setUser(serializedUser));
    return isAdmin;
  } catch (error) {
    console.error('Error during sign-in:', error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false)); 
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
    Swal.fire({
      title: 'Success!',
      text: 'Password reset email sent successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
    dispatch(setUser());
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Fetched user data:', userData);  
      return userData;
    }
    throw new Error('User not found');
  }
);



export const editUserProfile = ({ uid, name, phone, profilePictureFile, username, address, preferences }) => async (dispatch) => {
  dispatch(setLoading(true)); 
  try {
    let profilePictureUrl = null;
    if (profilePictureFile) {
      profilePictureUrl = await uploadProfilePicture(uid, profilePictureFile);
    }

    const updatedData = {
      name,
      phone,
      username,
      address,
      preferences: preferences || [],
    };

    if (profilePictureUrl) {
      updatedData.profilePicture = profilePictureUrl;
    }

    await updateUserInFirestore(uid, updatedData);
    dispatch(updateUser(updatedData));
    dispatch(setUserPreferences(updatedData.preferences));

    Swal.fire({
      title: 'Success!',
      text: 'Profile updated successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    dispatch(setError(error.message));
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  } finally {
    dispatch(setLoading(false)); 
  }
};




const uploadProfilePicture = async (uid, file) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Profile picture uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error("Failed to upload profile picture");
  }
};


const updateUserInFirestore = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData, { merge: true });
    console.log('User profile updated in Firestore:', userData);
  } catch (error) {
    console.error('Error updating user profile in Firestore:', error);
    throw new Error("Failed to update user profile");
  }
};


export default authSlice.reducer;