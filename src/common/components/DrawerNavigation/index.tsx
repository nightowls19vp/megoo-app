import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RouteNames from '../../../constants/route-names.const';
import BottomNavigationBar from '../BottomNavigationBar';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import userStore from '../../store/user.store';
import {Colors} from '../../../constants/color.const';
import appStore from '../../store/app.store';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: 0,
        // backgroundColor: Colors.itemBackground,
      }}>
      <View
        style={{
          backgroundColor: Colors.itemBackground,
          height: '30%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {appStore.isLoggedIn ? (
          <>
            <Image
              source={{
                uri: userStore.avatar,
              }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 150 / 2,
                marginBottom: 20,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                color: Colors.textSecondary,
                fontSize: 18,
                fontWeight: 'bold',
              }}
              numberOfLines={2}>
              {userStore.name}
            </Text>
          </>
        ) : (
          <>
            <Image
              source={{
                uri: 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
              }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 150 / 2,
                marginBottom: 20,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteNames.LOGIN as never);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.textSecondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                numberOfLines={2}>
                Đăng nhập/Đăng ký
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={{flex: 1}}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Chat screen</Text>
    </View>
  );
};

const DrawerNavigation = ({navigation}: {navigation: any}) => {
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.HOME_STACK_DRAWER}
      drawerContent={props => <CustomDrawerContent {...props} />}
      backBehavior="none"
      screenOptions={{
        drawerLabelStyle: {marginLeft: -15},
        drawerActiveTintColor: Colors.drawerItem,
        headerRight: () => {
          return (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 15,
                marginRight: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Search');
                }}>
                <Ionicons name="search-outline" size={24} color={'black'} />
              </TouchableOpacity>
              {appStore.isLoggedIn ? (
                <TouchableOpacity
                  onPress={() => {
                    console.log('Chat');
                    navigation.navigate(RouteNames.CHAT_STACK);
                    // navigation.goBack();
                  }}>
                  <Ionicons
                    // name="chatbubble-ellipses-outline"
                    name="md-chatbubble-ellipses-outline"
                    size={24}
                    color={'black'}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        },
      }}>
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang chủ',
          drawerIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
        name={RouteNames.HOME_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.HOME_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý gói',
          drawerIcon: ({color}) => (
            <Icon name="addusergroup" size={20} color={color} />
          ),
        }}
        name={RouteNames.PACKAGE_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PACKAGE_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Quản lý kho',
          drawerIcon: ({color}) => <Icon name="isv" size={20} color={color} />,
        }}
        name={RouteNames.STORAGE_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.STORAGE_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Trang cá nhân',
          drawerIcon: ({color}) => <Icon name="user" size={20} color={color} />,
        }}
        name={RouteNames.PROFILE_STACK}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PROFILE_STACK}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          drawerLabel: 'Cài đặt',
          drawerIcon: ({color}) => (
            <Icon name="setting" size={20} color={color} />
          ),
        }}
        name={RouteNames.SETTINGS_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.SETTINGS_STACK_BOTTOM}}
      />
    </Drawer.Navigator>
  );
};
export default observer(DrawerNavigation);
