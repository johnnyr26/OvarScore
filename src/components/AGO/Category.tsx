import React from 'react';
import {View, Text} from 'react-native';
import RadioButton from '../RadioButton';
import CategoryType from '../../constants/Category';
import styles from './styles';

const Category: React.FunctionComponent<{
  title: string;
  subTitle?: string;
  options?: string[];
}> = ({title, subTitle, options}) => (
  <View style={styles.container}>
    {options?.length === 0 ? (
      <>
        <Text style={styles.title}>Recommendation:</Text>
        <Text style={styles.title}>{title}</Text>
      </>
    ) : (
      <Text style={styles.title}>{title}</Text>
    )}
    {subTitle && (
      <Text style={styles.subTitle} adjustsFontSizeToFit numberOfLines={1}>
        {subTitle}
      </Text>
    )}
    <View style={styles.radioContainer}>
      {options &&
        options.map((option, index) => (
          <RadioButton
            key={index}
            categoryType={CategoryType.AGO}
            categoryTitle={title}
            title={option}
          />
        ))}
    </View>
    {options && options.length > 0 && <View style={styles.line} />}
  </View>
);

export default Category;
