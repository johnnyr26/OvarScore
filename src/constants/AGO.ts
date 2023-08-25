type CategoryObject = {
  title?: string;
  subTitle?: string;
  recommendation?: string;
  response?: string;
  lastSelected?: boolean;
};

type AGOType = {
  viewableCategories: CategoryObject[];
};

const categories: CategoryObject[] = [
  {
    title: 'Disease-free interval > 6 months',
    subTitle: '',
  },
  {
    title: 'Good Performance Status',
    subTitle: '(ECOG = 0)',
  },
  {
    title: 'No Residuals After Primary Surgery',
    subTitle: '(If Unknown FIGO stage I/II Initially)',
  },
  {
    title: 'No Or Small Volume Of Ascities',
    subTitle: '(Less than < 500 mL)',
  },
  {
    title: 'Peritoneal Carcinomatosis?',
    subTitle: '',
  },
];

export type {AGOType, CategoryObject};
export {categories};
