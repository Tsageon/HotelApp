import { createSlice } from '@reduxjs/toolkit'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../Config/Fire';

const initialState = {
 data:[],
 loading: false,
 error: null
}

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
   setLoading(state) {
    state.loading = true;
    state.error = null;
   },
   setData(state, action){
    state.data = action.payload;
    state.loading = false;
  },
   setError(state, action) {
    state.error = action.payload;
    state.loading = false;
  },
  
  },
}
)

// Action creators are generated for each case reducer function
export const { setLoading, setData, setError } = dbSlice.actions

export default dbSlice.reducer
export const fetchData = () => async (dispatch) => {
    dispatch(setLoading());
  
    try {
    
      const querySnapshot = await getDocs(collection(db, "Rooms"));
      
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,     
        ...doc.data(),   
      }));
  
      if (data.length === 0) {
        console.log('Warning: No documents found in the "Rooms" collection!');
      }
      dispatch(setData(data));
    } catch (error) {
      dispatch(setError(error.message));
      console.error('Error fetching documents from Firebase:', error);
    }
  };