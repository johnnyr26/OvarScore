import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Homepage from '../views/Homepage';
import IModel from '../views/iModel/IModel';
import Fagotti from '../views/Fagotti/Fagotti';
import AGO from '../views/AGO/AGO';

const Stack = createNativeStackNavigator();

const OvarScoreStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Homepage"
      component={Homepage}
      options={{headerShown: false}}
    />
    <Stack.Screen name="iModel" component={IModel} />
    <Stack.Screen name="Fagotti" component={Fagotti} />
    <Stack.Screen name="AGO" component={AGO} />
  </Stack.Navigator>
);

export default OvarScoreStack;
