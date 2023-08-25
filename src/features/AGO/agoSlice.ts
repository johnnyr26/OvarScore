import {createSlice} from '@reduxjs/toolkit';
import {categories} from '../../constants/AGO';
import {calculatePath} from '../../helpers/AGO/calculatePath';

const initialState = {
  viewableCategories: [categories[0]],
};

export const agoSlice = createSlice({
  name: 'AGO',
  initialState,
  reducers: {
    updateResponse: (state, action) => {
      state.viewableCategories = state.viewableCategories.splice(
        0,
        state.viewableCategories.findIndex(
          category => category.title === action.payload.title,
        ) + 1,
      );
      const updatedCategories = state.viewableCategories.map(category => {
        if (category.title === action.payload.title) {
          return {
            ...category,
            response: action.payload.response,
            lastSelected: true,
          };
        }
        return {...category, lastSelected: false};
      });
      state.viewableCategories = calculatePath(updatedCategories);
    },
    clearResponses: state => {
      state.viewableCategories = [categories[0]];
    },
  },
});

export const {updateResponse, clearResponses} = agoSlice.actions;

export default agoSlice.reducer;
