import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/index.js'; 
import taskReducer from './task/index.js';
import feedbackReducer from './feedback/index.js';
import adminReducer from './admin/index.js'
import statsReducer from './landing-page/index.js'; 
import testimonialReducer from './testimonials.js/index.js'
const rootReducer = combineReducers({
  stats: statsReducer,
  auth: authReducer,
  task:taskReducer,
  feedback: feedbackReducer,
  admin: adminReducer,
  testimonials:testimonialReducer 
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
