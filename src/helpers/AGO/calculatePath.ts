import {CategoryObject, categories} from '../../constants/AGO';

const calculatePath = (viewableCategories: CategoryObject[]) => {
  if (viewableCategories.every(category => !category.response)) {
    return viewableCategories;
  }
  if (viewableCategories[0].response === 'No') {
    return [
      viewableCategories[0],
      {
        recommendation: 'No Surgery',
      },
    ] as CategoryObject[];
  }
  const responseIndex = viewableCategories.findIndex(
    category => category.lastSelected,
  );

  if (responseIndex === -1) {
    return viewableCategories;
  }

  const lastResponseCategory = viewableCategories[responseIndex];
  if (lastResponseCategory.response === 'No') {
    if (lastResponseCategory.title === 'Peritoneal Carcinomatosis?') {
      return [
        ...viewableCategories,
        {
          recommendation: 'Surgery',
        },
      ] as CategoryObject[];
    } else {
      viewableCategories.push(categories[categories.length - 1]);
      return viewableCategories as CategoryObject[];
    }
  }
  if (lastResponseCategory.title === 'Peritoneal Carcinomatosis?') {
    return [
      ...viewableCategories,
      {
        recommendation: 'No Surgery',
      },
    ] as CategoryObject[];
  }
  if (responseIndex >= 0) {
    return [...viewableCategories, categories[responseIndex + 1]];
  }
  return [
    ...viewableCategories,
    {
      recommendation: 'No Surgery',
    },
  ] as CategoryObject[];
};

export {calculatePath};
