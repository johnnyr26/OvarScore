import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Container from '../Container';
import ScoreContainer from '../ScoreContainer';
import {FagottiType, table} from '../../constants/Fagotti';
import styles from './styles';
import {useSelector, useDispatch} from 'react-redux';
import {updateResponse} from '../../features/Fagotti/fagottiSlice';

const Table = () => {
  const tableRecommendation = useSelector(
    (state: {fagotti: FagottiType}) => state.fagotti.tableRecommendation,
  );
  const score = useSelector(
    (state: {fagotti: FagottiType}) => state.fagotti.score,
  );
  const Header = () => (
    <View style={styles.headerContainer}>
      {table.header.map((title, key) => (
        <View style={styles.header} key={key}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      ))}
    </View>
  );

  const Category: React.FunctionComponent<{
    title: string;
    responses: string[];
  }> = ({title, responses}) => {
    const dispatch = useDispatch();
    const response = useSelector(
      (state: {fagotti: FagottiType}) => state.fagotti.responses,
    )[title];

    const responseStyle = (category: string) => {
      return category === response
        ? {
            ...styles.response,
            ...styles.selected,
          }
        : {
            ...styles.response,
          };
    };

    return (
      <View style={styles.categoryContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <View style={responseStyle(responses[0])}>
          <TouchableOpacity
            onPress={() =>
              dispatch(updateResponse({title, response: responses[0]}))
            }>
            <Text style={styles.responseText}>{responses[0]}</Text>
          </TouchableOpacity>
        </View>
        <View style={responseStyle(responses[1])}>
          <TouchableOpacity
            onPress={() =>
              dispatch(updateResponse({title, response: responses[1]}))
            }>
            <Text style={styles.responseText}>{responses[1]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <Header />
      <>
        {Object.entries(table.categories).map(([title, responses], key) => (
          <Category key={key} title={title} responses={responses} />
        ))}
      </>
      <ScoreContainer score={score} recommendation={tableRecommendation} />
    </Container>
  );
};

export default Table;
