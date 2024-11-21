import {configureStore} from '@reduxjs/toolkit';
import auth from './authSlice';
import project from './projectSlice';
import orderProcess from './orderProcessSlice';

export const store = configureStore({
  reducer: {auth, project, orderProcess},
});
