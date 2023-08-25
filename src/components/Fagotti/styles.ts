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
    marginBottom: 12,
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
  headerContainer: {
    flexDirection: 'row',
    borderColor: 'transparent',
    borderBottomColor: '#a3a3a3',
    borderWidth: 1,
    alignSelf: 'stretch',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 3,
  },
  headerText: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    borderColor: 'transparent',
    borderBottomColor: '#a3a3a3',
    borderWidth: 1,
    alignSelf: 'stretch',
    minHeight: 96,
  },
  response: {
    display: 'flex',
    justifyContent: 'center',
    flex: 3,
  },
  responseText: {
    textAlign: 'center',
    fontSize: 12,
  },
  selected: {
    backgroundColor: 'rgba(0, 128, 128, 0.3)',
  },
});

export default styles;
