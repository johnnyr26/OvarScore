import React, {useState} from 'react';
import {View, Text, Dimensions, ViewStyle, StyleProp} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SafeView from '../components/SafeView';
import Container from '../components/Homepage/Container';
import styles from './styles';

type RootStackParamList = {
  Homepage: undefined;
  Fagotti: undefined;
  iModel: undefined;
  Ago: undefined;
};

type Props = NativeStackNavigationProp<RootStackParamList, 'Homepage'>;

const Homepage: React.FunctionComponent<{
  navigation: Props;
}> = ({navigation}) => {
  const [dim, setDim] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  });
  Dimensions.addEventListener('change', e => {
    const {width, height} = e.window;
    setDim({width, height});
  });

  const flexDirection: StyleProp<ViewStyle> =
    dim.height < dim.width ? {flexDirection: 'row'} : {};
  return (
    <SafeView>
      <View style={styles.homepage}>
        <View style={styles.titleView}>
          <Text style={styles.title}>OvarScore</Text>
        </View>
        <View style={flexDirection}>
          <Container
            diseaseType={'Primary Disease'}
            scoringMethod={['Fagotti']}
            navigation={navigation}
            views={['Fagotti']}
          />
          <Container
            diseaseType={'Recurrent Disease'}
            scoringMethod={['AGO', 'iModel']}
            navigation={navigation}
            views={['AGO', 'iModel']}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default Homepage;
