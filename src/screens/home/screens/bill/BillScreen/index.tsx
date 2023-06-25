import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../../../constants/color.const';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const BillScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Hóa đơn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: width,
    minHeight: height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
});

export default BillScreen;
