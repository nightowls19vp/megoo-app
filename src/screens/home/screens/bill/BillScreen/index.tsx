import {Formik} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../../common/default';
import {
  changeStatusBillToVietnamese,
  dateISOFormat,
  splitString,
} from '../../../../../common/handle.string';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {createBill} from './services/bill-service';
import {getMembers} from '../../../../../services/group.service';
import styles from './styles/style';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tên khoản chi tiêu'),
  date: Yup.string().required('Vui lòng chọn ngày'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
  amount: Yup.string(),
  lender: Yup.string().required('Vui lòng chọn người cho mượn'),
  borrower: Yup.string(),
});

const BillScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = route.params.groupId;

  const [members, setMembers] = useState([
    {
      role: '',
      user: {
        _id: '',
        name: '',
        avatar: '',
        email: '',
        phone: '',
        dob: '',
      },
    },
  ]);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);

  const [isFocus, setIsFocus] = useState(false);

  // State to open and close the dropdown picker
  const [openLender, setOpenLender] = useState(false);
  const [openBorrowers, setOpenBorrowers] = useState(false);

  const [lender, setLender] = useState('');
  const [lenders, setLenders] = useState([{label: '', value: ''}]);

  const [borrower, setBorrower] = useState('');
  const [borrowers, setBorrowers] = useState([{label: '', value: ''}]);

  const [selectedBorrower, setCurrentBorrower] = useState({
    _id: '',
    email: '',
    name: '',
    avatar: '',
  });
  const [amount, setAmount] = useState(0);
  const [selectedBorrowers, setSelectedBorrowers] = useState<any[]>([]);

  const getMemberList = async () => {
    try {
      console.log('groupId', groupId);

      const response = await getMembers(groupId);
      console.log('members', response.group.members);
      setMembers(response.group.members);

      setLenders(
        response.group.members.map((member: any) => {
          return {label: member.user.email, value: member.user.email};
        }),
      );

      setBorrowers(
        response.group.members.map((member: any) => {
          return {label: member.user.email, value: member.user.email};
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getMemberList();
  }, []);

  useEffect(() => {
    setTotalAmount(
      selectedBorrowers.reduce(
        (total: number, borrower: any) => total + parseFloat(borrower.amount),
        0,
      ),
    );
  }, [selectedBorrowers]);

  // If user changes the lender, remove the lender from the selected borrowers
  useEffect(() => {
    console.log('lender', lender);

    const index = selectedBorrowers.findIndex(
      (borrower: any) => borrower.email === lender,
    );

    if (index > -1) {
      setSelectedBorrowers(
        selectedBorrowers.filter((borrower: any) => borrower.email !== lender),
      );
      setAmount(0);
    }
  }, [lender]);

  return (
    <Formik
      initialValues={{
        summary: '',
        date: '',
        description: '',
        lender: '',
        borrower: '',
        amount: '',
      }}
      validationSchema={BillSchema}
      onSubmit={async values => {
        console.log('summary:', values.summary);
        console.log('date:', values.date);
        console.log('desc:', values.description);
        console.log('lender:', values.lender);

        const dateSOString = dateISOFormat(values.date);

        // Get lender in members array
        const selectedlender = members.find(
          (member: any) => member.user.email === values.lender,
        );

        const bill = {
          summary: values.summary,
          date: dateSOString,
          lender: selectedlender?.user._id,
          borrowers: selectedBorrowers.map((borrower: any) => {
            return {
              borrower: borrower._id,
              amount: borrower.amount,
            };
          }),
          description: values.description,
        };

        console.log('bill', bill);

        const response = await createBill(groupId, bill);
        console.log('Create bill response:', response);

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: 'Tạo khoản chi tiêu thành công',
            autoHide: true,
            visibilityTime: 1000,
            topOffset: 30,
            onHide: () => {
              navigation.navigate(
                RouteNames.BILL_MANAGEMENT as never,
                {} as never,
              );
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: response.message,
            autoHide: false,
            topOffset: 30,
          });
        }
      }}
      onReset={(values, actions) => {
        console.log('reset');

        // Reset values.borrower, values.amount
        actions.setFieldValue('borrower', '');
        actions.setFieldValue('amount', '');
        actions.setTouched({borrower: false, amount: false});

        console.log('values', values);
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
        handleReset,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 20}]}>
            Tên khoản chi tiêu
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tên khoản chi tiêu'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.summary}
            />
            {values.summary && (
              <Ionicons
                onPress={() => setFieldValue('summary', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.summary && errors.summary && (
            <Text style={styles.error}>{errors.summary}</Text>
          )}

          <Text style={styles.title}>Ngày</Text>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('date', value)}
              onBlur={() => setFieldTouched('date')}
              placeholder={'Chọn ngày'}
              style={styles.inputText}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.date}
            />

            <DatePicker
              modal
              open={open}
              date={date}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={value => {
                console.log('Selected date:', value);

                setOpen(false);
                setDate(value);
                setFieldValue('date', moment(value).format('DD/MM/YYYY'));

                console.log('Values date', values.date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            {values.date && (
              <Ionicons
                onPress={() => setFieldValue('date', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Ionicons
              onPress={() => {
                setOpen(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>
          {touched.date && errors.date && (
            <Text style={styles.error}>{errors.date}</Text>
          )}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập mô tả'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.description}
            />
            {values.description && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.description && errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <View
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              // backgroundColor: 'pink',
              marginVertical: 10,
            }}>
            <Text style={[styles.title, {fontSize: 18, width: '50%'}]}>
              Tổng tiền
            </Text>
            <View
              style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'baseline',
                flexDirection: 'row',
                gap: 10,
                // backgroundColor: 'yellow',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: Colors.text.grey,
                }}>
                {splitString(totalAmount.toString())}
              </Text>
              <Text style={{fontSize: 20, color: Colors.text.lightgrey}}>
                VND
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Người cho mượn</Text>
          <View style={styles.lenderContainer}>
            {/* <DropDownPicker
              containerStyle={{
                width: '100%',
                zIndex: 1000,
                padding: 0,
                marginBottom: 5,
              }}
              dropDownContainerStyle={{
                borderColor: Colors.border.lightgrey,
                borderRadius: 0,
              }}
              style={{
                borderWidth: 0,
                borderBottomWidth: 1,
                borderRadius: 0,
                paddingLeft: 0,
                paddingRight: 0,
                minHeight: 40,
                borderColor: Colors.border.lightgrey,
              }}
              selectedItemLabelStyle={{color: Colors.title.orange}}
              open={openLender}
              value={lender}
              items={lenders}
              placeholder="Chọn người cho mượn"
              placeholderStyle={{color: Colors.text.lightgrey}}
              setOpen={setOpenLender}
              setValue={setLender}
              setItems={setLenders}
              searchable={true}
              onSelectItem={(item: any) => {
                setLender(item);
                setFieldValue('lender', item.value);

                // Remove lender from borrowers
                const index = borrowers.findIndex(
                  (borrower: any) => borrower.label === item.label,
                );

                if (index > -1) {
                  setBorrowers(
                    members
                      .map((member: any) => {
                        return {
                          label: member.user.email,
                          value: member.user.email,
                        };
                      })
                      .filter((borrower: any) => borrower.label !== item.label),
                  );
                }
              }}
            /> */}

            <Dropdown
              style={{
                width: '100%',
              }}
              data={lenders}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Chọn người cho mượn' : '...'}
              placeholderStyle={{
                color: Colors.text.lightgrey,
              }}
              value={lender}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setLender(item.value);
                setFieldValue('lender', item.value);

                setIsFocus(false);

                // Remove lender from borrowers
                const index = borrowers.findIndex(
                  (borrower: any) => borrower.label === item.label,
                );

                if (index > -1) {
                  setBorrowers(
                    members
                      .map((member: any) => {
                        return {
                          label: member.user.email,
                          value: member.user.email,
                        };
                      })
                      .filter((borrower: any) => borrower.label !== item.label),
                  );
                }
              }}
            />
            {/* {lenderError ? renderError('Vui lòng chọn người cho mượn') : null} */}
          </View>
          {touched.lender && errors.lender && (
            <Text style={styles.error}>{errors.lender}</Text>
          )}

          <Text style={[styles.title, {marginTop: 5}]}>Người mượn</Text>
          <View style={styles.borrowerContainer}>
            <View style={[styles.addBorrowerContainer]}>
              {/* <DropDownPicker
                containerStyle={{
                  width: '100%',
                  zIndex: 1000,
                  padding: 0,
                  marginBottom: 5,
                }}
                dropDownContainerStyle={{
                  borderColor: Colors.border.lightgrey,
                  borderRadius: 0,
                }}
                style={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderRadius: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  minHeight: 40,
                  borderColor: Colors.border.lightgrey,
                }}
                selectedItemLabelStyle={{color: Colors.title.orange}}
                zIndex={100000}
                open={openBorrowers}
                value={borrower}
                items={borrowers}
                placeholder="Chọn người mượn"
                placeholderStyle={{color: Colors.text.lightgrey}}
                setOpen={setOpenBorrowers}
                setValue={setBorrower}
                setItems={setBorrowers}
                onSelectItem={(item: any) => {
                  setFieldValue('borrower', item.value);

                  //Find borrower in members
                  const index = members.findIndex(
                    (member: any) => member.user.email === item.label,
                  );

                  // Set selected item to selectedBorrower
                  setCurrentBorrower({
                    _id: members[index].user._id,
                    email: members[index].user.email,
                    name: members[index].user.name,
                    avatar: members[index].user.avatar,
                  });
                }}
              /> */}
              <Dropdown
                style={{
                  width: '100%',
                }}
                data={borrowers}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Chọn người mượn' : '...'}
                placeholderStyle={{
                  color: Colors.text.lightgrey,
                }}
                value={borrower}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setBorrower(item.value);

                  setIsFocus(false);

                  setFieldValue('borrower', item.value);

                  //Find borrower in members
                  const index = members.findIndex(
                    (member: any) => member.user.email === item.label,
                  );

                  // Set selected item to selectedBorrower
                  setCurrentBorrower({
                    _id: members[index].user._id,
                    email: members[index].user.email,
                    name: members[index].user.name,
                    avatar: members[index].user.avatar,
                  });
                }}
              />
            </View>
            {touched.borrower && selectedBorrowers.length === 0 && (
              <Text style={styles.error}>Vui lòng chọn người mượn</Text>
            )}

            <Text style={styles.title}>Số tiền cần trả</Text>
            <View style={styles.amountContainer}>
              <TextInput
                onChangeText={value => {
                  setFieldValue('amount', value);
                  setAmount(parseFloat(value));
                }}
                // onBlur={() => setFieldTouched('amount')}
                // onChangeText={value => setAmount(parseFloat(value))}
                style={{
                  width: '70%',
                  textAlign: 'left',
                }}
                placeholder={'Nhập số tiền cần trả'}
                placeholderTextColor={Colors.text.lightgrey}
                keyboardType="numeric"
                value={splitString(values.amount)}
              />
              <Text style={{color: Colors.text.lightgrey}}>VND</Text>
            </View>
            {touched.amount && selectedBorrowers.length === 0 && (
              <Text style={styles.error}>Vui lòng nhập số tiền cần trả</Text>
            )}

            <TouchableOpacity
              style={styles.addBorrowerButton}
              onPress={() => {
                // handleReset();
                console.log('selectedBorrower', selectedBorrower);
                console.log('amount', values.amount);

                if (selectedBorrower._id && values.amount) {
                  // Check if borrower existed in selectedBorrowers
                  const index = selectedBorrowers.findIndex(
                    (borrower: any) => borrower._id === selectedBorrower._id,
                  );
                  console.log('index', index);

                  // Add borrower to selectedBorrowers
                  if (selectedBorrowers.length === 0) {
                    setSelectedBorrowers([
                      {
                        _id: selectedBorrower._id,
                        email: selectedBorrower.email,
                        name: selectedBorrower.name,
                        avatar: selectedBorrower.avatar,
                        amount: values.amount,
                        status: 'PENDING',
                      },
                    ]);
                  } else {
                    if (index < 0) {
                      setSelectedBorrowers([
                        ...selectedBorrowers,
                        {
                          _id: selectedBorrower._id,
                          email: selectedBorrower.email,
                          name: selectedBorrower.name,
                          avatar: selectedBorrower.avatar,
                          amount: values.amount,
                          status: 'PENDING',
                        },
                      ]);
                    }
                  }
                }
              }}>
              <Text style={styles.addBorrowerButtonText}>Thêm</Text>
            </TouchableOpacity>

            {selectedBorrowers ? (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                {selectedBorrowers.map((borrower: any, index) => {
                  const viStatus = changeStatusBillToVietnamese(
                    borrower.status,
                  );
                  return (
                    <View key={index} style={styles.borrowersContainer}>
                      <Image
                        source={{uri: borrower?.avatar || IMAGE_URI_DEFAULT}}
                        style={styles.borrowerAvatar}
                      />
                      <View style={styles.borrowerInfo}>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Người mượn: </Text>
                          <Text style={styles.text}>{borrower.name}</Text>
                        </View>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Số tiền mượn: </Text>
                          <Text style={styles.text}>
                            {splitString(borrower.amount)} VND
                          </Text>
                        </View>
                        <View style={styles.borrowerInfoRow}>
                          <Text style={styles.headingText}>Trạng thái: </Text>
                          <Text style={styles.text}>{viStatus}</Text>
                        </View>
                      </View>
                      <TouchableOpacity>
                        <Ionicons
                          onPress={() => {
                            // const borrowerIndex = borrowers.findIndex(
                            //   (borrower: any) => borrower === object,
                            // );
                          }}
                          name={'remove-circle'}
                          style={styles.deleteIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              false
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}
            disabled={!isValid}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Tạo</Text>
          </TouchableOpacity>
          <Toast position="top" />
        </ScrollView>
      )}
    </Formik>
  );
};

export default BillScreen;
