import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: width,
    minHeight: '100%',
  },
  avatar: {width: 200, height: 200, borderRadius: 200 / 2},
  title: {
    width: '90%',
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  groupInfoContainer: {
    display: 'flex',
    width: width * 0.9,
    gap: 20,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: Colors.background.white,
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.lightgrey,
  },
  activateGroupContainer: {
    display: 'flex',
    maxHeight: 30,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  activateGroupButton: {
    width: '25%',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonBackground.orange,
    borderRadius: 10,
  },
  activateGroupButtonText: {
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  inputContainer: {
    width: '70%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey},
  addButton: {
    width: '25%',
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    borderRadius: 10,
    backgroundColor: Colors.buttonBackground.white,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    marginTop: 10,
    width: '90%',
    color: Colors.error,
    textAlign: 'left',
  },
  emailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  email: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inviteButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    borderRadius: 10,
    backgroundColor: Colors.buttonBackground.white,
  },
  inviteButtonText: {
    color: Colors.text.orange,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 8,
    backgroundColor: Colors.buttonBackground.orange,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
