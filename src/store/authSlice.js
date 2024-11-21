import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataWithRef, postUserDataWithId } from "../DataBase/databaseFunction";

const initialState = {
  isAuth: null,
  isArabicLanguage: false,
  cartItems: [],
  favoriteItems: [],
  isLoading: false,
  selectedProducts: [],
  user: {
    id: null, // Assuming user id is stored here
    userEmail: " "
  },
};

// Thunk to fetch user profile from Firebase
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getDataWithRef("user", userId);
      return response.val();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update user profile in Firebase
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      await postUserDataWithId(userId, profileData); // Update data with postUserDataWithId function
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      if (action.payload.isAuth === null || action.payload.isAuth === undefined) {
        state.isAuth = null;
      } else {
        state.isAuth = action.payload.isAuth;
      }
    },
    toggleLanguage: (state) => {
      state.isArabicLanguage = !state.isArabicLanguage;
    },
    setFavoriteItems: (state, action) => {
      if (action.payload.favoriteItems === null || action.payload.favoriteItems === undefined) {
        state.favoriteItems = [];
      } else {
        state.favoriteItems = action.payload.favoriteItems;
      }
    },
    setCartItems: (state, action) => {
      if (action.payload.cartItems === null || action.payload.cartItems === undefined) {
        state.cartItems = [];
      } else {
        state.cartItems = action.payload.cartItems;
      }
    },
    setIsLoading: (state, action) => {
      state.isLoading = !state.isLoading;
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload.selectedProducts;
    },
    setUser: (state, action) => {
      state.user = action.payload; // Set user object to payload from action
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const {
  setAuth,
  toggleLanguage,
  setFavoriteItems,
  setCartItems,
  setIsLoading,
  setSelectedProducts,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
