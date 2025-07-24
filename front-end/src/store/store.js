import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/index.js'; 
import taskReducer from './task/index.js';
const rootReducer = combineReducers({
  auth: authReducer,
  task:taskReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
