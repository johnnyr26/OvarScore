import {createSlice} from '@reduxjs/toolkit';
import calculateScore from '../../helpers/iModel/calculateScore';
import {categories} from '../../constants/iModel';

const initialState = {
  responses: {} as {
    [key: string]: string;
  },
  score: 0,
  recommendation: '',
};

export const iModelSlice = createSlice({
  name: 'iModel',
  initialState,
  reducers: {
    updateResponse: (state, action) => {
      state.responses[action.payload.title] = action.payload.response;
      state.score = calculateScore(state.responses);
      const allFilled =
        Object.values(state.responses).length ===
        Object.values(categories).length;
      state.recommendation = allFilled
        ? state.score <= 4.7
          ? 'Surgery'
          : 'No Surgery'
        : '';
    },
    clearResponses: state => {
      state.responses = {};
      state.score = 0;
      state.recommendation = '';
    },
  },
});

export const {updateResponse, clearResponses} = iModelSlice.actions;

export default iModelSlice.reducer;
