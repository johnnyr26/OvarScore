import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styles from './styles';

type RootStackParamList = {
  Homepage: undefined;
  Fagotti: undefined;
  iModel: undefined;
  Ago: undefined;
};

type Props = NativeStackNavigationProp<RootStackParamList, 'Homepage'>;

const Container: React.FunctionComponent<{
  diseaseType: string;
  scoringMethod: string[];
  navigation: Props;
  views: string[];
}> = ({diseaseType, scoringMethod, navigation, views}) => (
  <View style={styles.container}>
    <Text style={styles.disease}>{diseaseType}</Text>
    <View style={styles.scoreContainer}>
      {scoringMethod.map((method, index) => (
        <View key={index} style={styles.scoringMethod}>
          <Text adjustsFontSizeToFit style={styles.score}>
            {method}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                CommonActions.navigate({
                  name: views[index],
                }),
              );
            }}
            style={styles.clickHere}>
            <Text adjustsFontSizeToFit style={styles.clickHereText}>
              Click Here
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

export default Container;
