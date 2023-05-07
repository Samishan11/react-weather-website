import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
const reducer = {
    [apiSlice.reducerPath]: apiSlice.reducer,
}
export const store = configureStore({
    reducer: reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });