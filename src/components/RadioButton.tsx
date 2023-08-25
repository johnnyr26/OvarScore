import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateResponse as updateAgo} from '../features/AGO/agoSlice';
import {updateResponse as updateIModel} from '../features/iModel/iModelSlice';
import {updateResponse as updateFagotti} from '../features/Fagotti/fagottiSlice';
import {AGOType} from '../constants/AGO';
import {iModelType} from '../constants/iModel';
import {FagottiType} from '../constants/Fagotti';

const styles = StyleSheet.create({
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  radioButton: {
    borderRadius: 100,
    height: 25,
    width: 25,
    backgroundColor: 'transparent',
    borderColor: '#d3d3d3',
    borderWidth: 3,
    marginRight: 5,
  },
  selected: {
    backgroundColor: '#d3d3d3',
  },
  radioText: {
    fontSize: 25,
  },
});

enum Category {
  AGO,
  iModel,
  Fagotti,
}

const RadioButton: React.FunctionComponent<{
  title: string;
  categoryType: Category;
  categoryTitle: string;
}> = ({title, categoryType, categoryTitle}) => {
  const dispatch = useDispatch();

  const categoryResponse = useSelector(
    (state: {ago: AGOType; iModel: iModelType; fagotti: FagottiType}) => {
      if (categoryType === Category.AGO) {
        return state.ago.viewableCategories.find(
          category => category.title === categoryTitle,
        )?.response;
      }
      if (categoryType === Category.iModel) {
        return state.iModel.responses[categoryTitle];
      }
      if (categoryType === Category.Fagotti) {
        return state.fagotti.responses[categoryTitle];
      }
    },
  );

  const radioStyle =
    title === categoryResponse
      ? {
          ...styles.radioButton,
          ...styles.selected,
        }
      : {
          ...styles.radioButton,
        };
  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={() => {
        const response = {title: categoryTitle, response: title};
        if (categoryType === Category.AGO) {
          dispatch(updateAgo(response));
        } else if (categoryType === Category.iModel) {
          dispatch(updateIModel(response));
        } else {
          dispatch(updateFagotti(response));
        }
      }}>
      <View style={radioStyle} />
      <Text style={styles.radioText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
