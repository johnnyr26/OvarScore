import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginBottom: 25,
    marginLeft: 12.5,
    marginRight: 12.5,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scoringMethod: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  disease: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    fontSize: 30,
    fontWeight: '300',
  },
  clickHere: {
    backgroundColor: 'rgba(0, 128, 128, 0.5)',
    padding: 12,
    borderRadius: 15,
    fontSize: 24,
    margin: 5,
    alignSelf: 'stretch',
  },
  clickHereText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default styles;
