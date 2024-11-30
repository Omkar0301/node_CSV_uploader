import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import productImageReducer from "./productImageSlice";


const store = configureStore({
  reducer: {
    products: productReducer,
    productImage: productImageReducer,
  },
});

export default store;
