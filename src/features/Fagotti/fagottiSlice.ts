import {createSlice} from '@reduxjs/toolkit';
import {firstSection, table} from '../../constants/Fagotti';

const initialState = {
  responses: {} as {[title: string]: string},
  showTable: false,
  firstSectionRecommendation: '',
  tableRecommendation: '',
  score: 0,
};

export const fagottiSlice = createSlice({
  name: 'Fagotti',
  initialState,
  reducers: {
    updateResponse: (state, action) => {
      state.firstSectionRecommendation = '';
      state.tableRecommendation = '';
      state.score = 0;
      state.showTable = false;
      const {title, response} = action.payload as {
        title: string;
        response: string;
      };
      state.responses[title] = response;
      Object.entries(state.responses).forEach(([key, res]) => {
        if (Object.keys(table.categories).includes(key)) {
          const twoPointResponse =
            table.categories[key as keyof typeof table.categories][0];
          if (res === twoPointResponse) {
            state.score += 2;
          }
        }
      });

      if (
        firstSection.includes(title) &&
        Object.values(state.responses).includes('Yes')
      ) {
        state.firstSectionRecommendation = 'No Surgery';
      } else if (Object.values(state.responses).length >= firstSection.length) {
        state.showTable = true;
      }
      const allFilled =
        Object.values(state.responses).length ===
        firstSection.length + Object.values(table.categories).length;
      if (allFilled) {
        state.tableRecommendation = state.score < 10 ? 'Surgery' : 'No Surgery';
      }
    },
    clearResponses: state => {
      state.responses = {};
      state.showTable = false;
      state.firstSectionRecommendation = '';
      state.tableRecommendation = '';
      state.score = 0;
    },
  },
});

export const {updateResponse, clearResponses} = fagottiSlice.actions;

export default fagottiSlice.reducer;
