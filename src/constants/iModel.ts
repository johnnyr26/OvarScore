type Scores = {
  [key: string]: {
    options: string[];
    scoredOptions: string[];
    score: number;
  };
};

type iModelType = {
  responses: {
    [key: string]: string;
  };
  score: number;
  recommendation: string;
};

const categories: Scores = {
  'FIGO Stage': {
    options: ['I', 'II', 'III', 'IV'],
    scoredOptions: ['III', 'IV'],
    score: 0.8,
  },
  'Residual Disease After Primary Surgery': {
    options: ['0', '>0'],
    scoredOptions: ['>0'],
    score: 1.5,
  },
  'Progression Free Interval': {
    options: ['<16', '≥16'],
    scoredOptions: ['<16'],
    score: 2.4,
  },
  'ECOG Performance Status': {
    options: ['0-1', '2-3'],
    scoredOptions: ['2-3'],
    score: 2.4,
  },
  'CA125 At Recurrence (U/ml)': {
    options: ['≤105', '>105'],
    scoredOptions: ['>105'],
    score: 1.8,
  },
  'Ascites At Recurrence': {
    options: ['Present', 'Absent'],
    scoredOptions: ['Present'],
    score: 3,
  },
};

export type {Scores, iModelType};
export {categories};
