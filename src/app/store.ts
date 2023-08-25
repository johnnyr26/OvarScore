import {configureStore} from '@reduxjs/toolkit';
import agoReducer from '../features/AGO/agoSlice';
import iModelReducer from '../features/iModel/iModelSlice';
import fagottiReducer from '../features/Fagotti/fagottiSlice';

export const store = configureStore({
  reducer: {
    ago: agoReducer,
    iModel: iModelReducer,
    fagotti: fagottiReducer,
  },
});
