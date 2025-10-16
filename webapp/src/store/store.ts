import { configureStore } from '@reduxjs/toolkit';
import toggleReducer from './toggleSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
        toggleReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
