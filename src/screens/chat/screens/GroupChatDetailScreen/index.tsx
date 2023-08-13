import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

import {RouteProp, useRoute} from '@react-navigation/native';

import {getMembers} from '../../../../services/group.service';
import {Colors} from '../../../../constants/color.const';
import userStore from '../../../../common/store/user.store';

type GroupChatRouteParams = {
  channelUrl: string;
  groupId: string;
};

// Specify the type for the route
type GroupChatRouteProp = RouteProp<
  Record<string, GroupChatRouteParams>,
  string
>;

const GroupChatDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupChatRouteProp>();
  const {channelUrl, groupId} = route.params;

  const [members, setMembers] = useState<
    {
      _id: string;
      name: string;
      avatar: string;
      phone: string;
      email: string;
      role: string;
    }[]
  >([]);

  const getGroupMembers = async () => {
    try {
      const response = await getMembers(groupId);
      console.log('Get members response', response.group.members);

      if (
        !response.group?.members ||
        !response?.group?.members.length ||
        response?.group?.members.length === 0
      ) {
        return [];
      } else {
        setMembers(
          response.group.members.map((member: any) => {
            return {
              _id: member.user._id,
              name: member.user.name,
              avatar: member.user.avatar,
              phone: member.user.phone,
              email: member.user.email,
              role: member.role,
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(route.params);

    getGroupMembers();
  }, []);

  useEffect(() => {
    console.log(members);
  }, [members]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách thành viên</Text>
      <View style={styles.memberListContainer}>
        {members.map((member, index) => {
          return (
            <View key={member._id} style={styles.memberContainer}>
              <View style={styles.memberInfoContainer}>
                <Image source={{uri: member.avatar}} style={styles.avatar} />
                <Text
                  style={
                    member.role === 'Super User'
                      ? styles.superUserName
                      : styles.memberName
                  }>
                  {member.name}
                </Text>
                {member.role === 'Super User' ? (
                  <Foundation
                    name="crown"
                    size={20}
                    color={Colors.icon.orange}
                  />
                ) : (
                  false
                )}
              </View>
              {member._id !== userStore.id ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${member.phone}`);
                  }}>
                  <Foundation
                    name="telephone"
                    size={24}
                    color={Colors.icon.orange}
                  />
                </TouchableOpacity>
              ) : (
                false
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
  },
  title: {
    width: '90%',
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  memberListContainer: {
    width: '90%',
    display: 'flex',
    // flexDirection: 'column',
    gap: 10,
  },
  memberContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberInfoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  superUserName: {
    fontSize: 14,
    color: Colors.text.orange,
    fontWeight: 'bold',
  },
});

export default GroupChatDetailScreen;
