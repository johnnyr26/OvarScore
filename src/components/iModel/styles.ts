import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 36,
    marginBottom: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  line: {
    borderColor: 'transparent',
    borderBottomColor: '#a3a3a3',
    borderWidth: 1,
    margin: 10,
    alignSelf: 'stretch',
  },
});

export default styles;
