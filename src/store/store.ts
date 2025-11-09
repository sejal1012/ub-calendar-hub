// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import planReducer from './planSlice';

export const store = configureStore({
  reducer: {
    // 'data' will be the key for this state in the global store
    data: planReducer, 
  },
});

// 1. INFER the RootState type from the store's state
export type RootState = ReturnType<typeof store.getState>;

// 2. INFER the AppDispatch type from the store itself
export type AppDispatch = typeof store.dispatch;