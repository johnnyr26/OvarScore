import React from 'react';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';

const SafeView: React.FunctionComponent<{
  edges?: Edge[];
  children: JSX.Element | JSX.Element[];
}> = ({edges = ['top', 'left', 'right'], children}) => (
  <SafeAreaView style={styles.safeView} edges={edges}>
    {children}
  </SafeAreaView>
);

export default SafeView;
