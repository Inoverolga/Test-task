import { configureStore } from "@reduxjs/toolkit";
import user from "../components/appForm/userSlice";

const store = configureStore({
  reducer: { user },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare(),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
