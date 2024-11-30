import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const fetchProductImage = createAsyncThunk(
  "productImage/fetchProductImage",
  async (productId) => {
    const response = await axios.get(
      `${apiBaseUrl}/api/products/${productId}/preview`,
      {
        responseType: "blob", // To fetch the image as a blob
      }
    );
    return URL.createObjectURL(response.data); // Convert blob to a URL
  }
);

// Initial state for product image
const initialState = {
  image: null,
  loading: false,
  error: null,
};

const productImageSlice = createSlice({
  name: "productImage",
  initialState,
  reducers: {
    resetImage: (state) => {
      state.image = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.image = action.payload; // Store the image URL in Redux
      })
      .addCase(fetchProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetImage } = productImageSlice.actions;

export default productImageSlice.reducer;
