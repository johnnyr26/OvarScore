import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  risk: {
    fontSize: 24,
    textAlign: 'center',
  },
  score: {
    fontWeight: '300',
    fontSize: 36,
    marginTop: 10,
  },
  recommendation: {
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
  },
});

const ScoreContainer: React.FunctionComponent<{
  risk?: boolean;
  recommendation?: string;
  score?: number;
}> = ({risk, recommendation, score}) => (
  <View style={styles.scoreContainer}>
    {risk && (
      <Text style={styles.risk} adjustsFontSizeToFit numberOfLines={1}>
        Low risk: ≤ 4.7; High risk: {'>'} 4.7
      </Text>
    )}
    {recommendation && (
      <>
        <Text
          style={styles.recommendation}
          adjustsFontSizeToFit
          numberOfLines={1}>
          Recommendation:
        </Text>
        <Text
          style={styles.recommendation}
          adjustsFontSizeToFit
          numberOfLines={1}>
          {recommendation}
        </Text>
      </>
    )}
    {score !== undefined && (
      <Text style={styles.score} adjustsFontSizeToFit numberOfLines={1}>
        Score: {score}
      </Text>
    )}
  </View>
);

export default ScoreContainer;
