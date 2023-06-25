import {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {RouteProp, useRoute} from '@react-navigation/native';

import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import appStore from '../../../../common/store/app.store';

import GroupsScreen from '../GroupsScreen';
import ProfileScreen from '../ProfileScreen';
import {observer} from 'mobx-react';

// Define the type for the route params
type GroupsRouteParams = {
  activeTab: string;
};

// Specify the type for the route
type GroupsRouteProp = RouteProp<Record<string, GroupsRouteParams>, string>;

const UserInfoScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupsRouteProp>();

  const [activeTab, setActiveTab] = useState(
    route.params?.activeTab === 'group' ? 'group' : 'info',
  );

  const renderTabContent = () => {
    if (activeTab === 'group') {
      return <GroupsScreen navigation={navigation} />;
    } else if (activeTab === 'info') {
      return <ProfileScreen navigation={navigation} />;
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const param = route.params?.activeTab;
  //     setActiveTab(param);
  //     console.log('route from payment screen:', route);
  //     console.log('param from payment screen:', param);
  //   }, []),
  // );

  return appStore.isLoggedIn ? (
    <View
      style={
        activeTab === 'group'
          ? [styles.container, {paddingBottom: 60}]
          : styles.container
      }>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'info'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('info');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'info'
                    ? Colors.buttonText.white
                    : Colors.buttonText.orange,
              },
            ]}>
            Thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'group'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('group');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'group'
                    ? Colors.buttonText.white
                    : Colors.buttonText.orange,
              },
            ]}>
            Nhóm
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          position: 'relative',
          top: 60,
          // minHeight: '100%',
        }}>
        {renderTabContent()}
      </ScrollView>
    </View>
  ) : (
    <View style={styles.loginContainer}>
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Vui lòng </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.LOGIN, {});
          }}>
          <Text style={[styles.loginText, {color: Colors.primary}]}>
            đăng nhập/đăng ký
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.loginText}>để sử dụng chức năng này.</Text>
    </View>
  );
};

export default observer(UserInfoScreen);
