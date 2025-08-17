import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/index.js'; 
import taskReducer from './task/index.js';
import feedbackReducer from './feedback/index.js';
import adminReducer from './admin/index.js'
import statsReducer from './landing-page/index.js'; 
const rootReducer = combineReducers({
  stats: statsReducer,
  auth: authReducer,
  task:taskReducer,
  feedback: feedbackReducer,
  admin: adminReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
