import React from 'react';
import {View, Text} from 'react-native';
import CategoryType from '../../constants/Category';
import RadioButton from '../RadioButton';
import styles from './styles';

const Category: React.FunctionComponent<{
  title: string;
  options: string[];
}> = ({title, options}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.radioContainer}>
      {options.map((option, index) => (
        <RadioButton
          key={index}
          title={option}
          categoryType={CategoryType.iModel}
          categoryTitle={title}
        />
      ))}
    </View>
    <View style={styles.line} />
  </View>
);
export default Category;
