import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Handle errors here
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
  });
});

export default store;