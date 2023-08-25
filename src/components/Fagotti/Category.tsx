import React from 'react';
import {View, Text} from 'react-native';
import RadioButton from '../RadioButton';
import CategoryType from '../../constants/Category';
import styles from './styles';

const Category: React.FunctionComponent<{
  title: string;
  options: string[];
}> = ({title, options}) => {
  return (
    <View style={styles.container}>
      {options?.length === 0 ? (
        <>
          <Text style={styles.title}>Recommendation:</Text>
          <Text style={styles.title}>{title}</Text>
        </>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={styles.radioContainer}>
        {options &&
          options.map((option, index) => (
            <RadioButton
              key={index}
              categoryType={CategoryType.Fagotti}
              categoryTitle={title}
              title={option}
            />
          ))}
      </View>
      {options && options.length > 0 && <View style={styles.line} />}
    </View>
  );
};

export default Category;
