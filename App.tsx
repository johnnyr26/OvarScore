import React from 'react';
import OvarScoreStack from './src/components/OvarScoreStack';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/app/store';

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <OvarScoreStack />
    </NavigationContainer>
  </Provider>
);

export default App;
