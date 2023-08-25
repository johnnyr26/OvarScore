import {categories, iModelType} from '../../constants/iModel';

const calculateScore = (responses: iModelType['responses']) => {
  let score = 0;
  Object.entries(responses).forEach(([key, value]) => {
    if (categories[key].scoredOptions.includes(value)) {
      score += categories[key].score;
    }
  });
  return Number.parseFloat(score.toFixed(1));
};

export default calculateScore;
