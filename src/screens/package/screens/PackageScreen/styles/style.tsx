import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const fontScale = Dimensions.get('window').fontScale;

const styles = StyleSheet.create({
  container: {
    // flexGrow  cannot be applied directly within flex: 1
    flexGrow: 1,
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  detailText: {
    fontSize: 12,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    color: Colors.primary,
  },
  text: {
    fontSize: 12,
    color: Colors.text,
  },
  packageContainer: {
    width: '90%',
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: Colors.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    borderRadius: 10,
    padding: 10,
  },
  pkgTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  carouselItemContainer: {
    width: width * 0.7,
    backgroundColor: Colors.background,
    // borderWidth: 1,
    // borderColor: 'black',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingHorizontal: 20,
  },
  carouselItem: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  descriptionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // marginHorizontal: 15,
  },
  button: {
    width: '45%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 5,
  },
  extendButton: {
    width: '100%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 5,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
