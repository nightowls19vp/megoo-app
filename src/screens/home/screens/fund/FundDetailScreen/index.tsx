import {Formik} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import CheckBox from '@react-native-community/checkbox';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {splitString} from '../../../../../common/handle.string';
import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getFundById} from './services/fund.service';
import styles from './styles/style';

type FundRouteParams = {
  fundId: string;
};

const FundSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tên quỹ'),
  startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
  times: Yup.string()
    .required('Vui lòng nhập chu kỳ nhắc nhở')
    .min(1, 'Chu kỳ nhắc nhở tối thiểu là 1 tháng')
    .max(12, 'Chu kỳ nhắc nhở tối đa là 12 tháng'),
  total: Yup.string().required('Vui lòng nhập tổng tiền'),
  // members: Yup.array().required('Vui lòng chọn thành viên'),
});

// Specify the type for the route
type FundRouteProp = RouteProp<Record<string, FundRouteParams>, string>;

const FundDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<FundRouteProp>();
  const fundId = route.params.fundId;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const [times, setTimes] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: '1 tháng',
      value: '1',
    },
    {
      label: '2 tháng',
      value: '2',
    },
    {
      label: '3 tháng',
      value: '3',
    },
    {
      label: '4 tháng',
      value: '4',
    },
    {
      label: '5 tháng',
      value: '5',
    },
    {
      label: '6 tháng',
      value: '6',
    },
    {
      label: '7 tháng',
      value: '7',
    },
    {
      label: '8 tháng',
      value: '8',
    },
    {
      label: '9 tháng',
      value: '9',
    },
    {
      label: '10 tháng',
      value: '10',
    },
    {
      label: '11 tháng',
      value: '11',
    },
    {
      label: '12 tháng',
      value: '12',
    },
  ]);

  const [fund, setFund] = useState<{
    _id: string;
    createdAt: string;
    description: string;
    ends: string;
    history: any[];
    members: {
      _id: string;
      email: string;
      name: string;
      avatar: string;
    }[];
    startDate: string;
    summary: string;
    times: number;
    total: number;
    updatedAt: string;
  }>({
    _id: '',
    createdAt: '',
    description: '',
    ends: '',
    history: [],
    members: [],
    startDate: '',
    summary: '',
    times: 0,
    total: 0,
    updatedAt: '',
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    fund.members.map((_, index) => index === 0),
  );

  const [amountArray, setAmountArray] = useState<number[]>([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const getFundDetail = async () => {
    try {
      const response = await getFundById(fundId);
      console.log('Get fund response', response);

      if (!response?.funding) {
        return;
      } else {
        setFund({
          _id: response?.funding?._id,
          createdAt: response?.funding?.createdAt,
          description: response?.funding?.description,
          ends: response?.funding?.ends,
          history: response?.funding?.history,
          members: response?.funding?.members?.map((member: any) => ({
            _id: member?._id,
            email: member?.email,
            name: member?.name,
            avatar: member?.avatar,
          })),
          startDate: response?.funding?.startDate,
          summary: response?.funding?.summary,
          times: response?.funding?.times,
          total: response?.funding?.total,
          updatedAt: response?.funding?.updatedAt,
        });
      }
    } catch (error) {
      console.log('Get fun by id error: ', error);
    }
  };

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);
  };

  const diviseAmount = (amount: number) => {
    // Count in toggleCheckBoxArray how many element have true value
    let count = 0;
    for (let i = 0; i < toggleCheckBoxArray.length; ++i) {
      if (toggleCheckBoxArray[i]) {
        count++;
      }
    }

    const result = amount / count;

    const updatedArray = [...amountArray];
    console.log('updatedAmountArray:', updatedArray);
    for (let i = 0; i < updatedArray.length; ++i) {
      updatedArray[i] = result;
    }
    console.log('updatedAmountArray:', updatedArray);
    setAmountArray(updatedArray);
    // add result to amount
  };

  useEffect(() => {
    console.log('Fund id', fundId);
    getFundDetail();
  }, []);

  useEffect(() => {
    console.log('Fund members:', fund.members);
  }, [fund]);
  return (
    <Formik
      initialValues={{
        summary: fund.summary,
        description: fund.description,
        times: fund.times.toString(),
        total: fund.total.toString(),
        startDate: '',
        ends: '',
      }}
      enableReinitialize
      validationSchema={FundSchema}
      onSubmit={async values => {
        console.log('values', values);
      }}>
      {({
        values,
        touched,
        errors,
        isValid,
        setFieldTouched,
        setFieldValue,
        handleChange,
        handleSubmit,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 10}]}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              style={styles.inputText}
              placeholder={'Nhập tiêu đề'}
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

          <Text style={styles.title}>Ngày bắt đầu</Text>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('startDate', value)}
              // onBlur={() => setFieldTouched('startDate')}
              style={styles.inputText}
              placeholder={'Chọn ngày bắt đầu'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.startDate}
            />

            <DatePicker
              modal
              open={openStartDatePicker}
              date={startDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={value => {
                console.log('Selected start date:', value);

                setOpenStartDatePicker(false);
                setStartDate(value);
                setFieldValue('startDate', moment(value).format('DD/MM/YYYY'));

                console.log('Values startDate', values.startDate);
              }}
              onCancel={() => {
                setOpenStartDatePicker(false);
              }}
            />
            {values.startDate && (
              <Ionicons
                onPress={() => setFieldValue('startDate', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}

            <Ionicons
              onPress={() => {
                setOpenStartDatePicker(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>
          {touched.startDate && errors.startDate && (
            <Text style={styles.error}>{errors.startDate}</Text>
          )}

          <Text style={styles.title}>Ngày kết thúc</Text>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('ends', value)}
              // onBlur={() => setFieldTouched('ends')}
              style={styles.inputText}
              placeholder={'Chọn ngày kết thúc'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.ends}
            />

            <DatePicker
              modal
              open={openEndDatePicker}
              date={endDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={value => {
                console.log('Selected end date:', value);

                setOpenEndDatePicker(false);
                setEndDate(value);
                setFieldValue('ends', moment(value).format('DD/MM/YYYY'));
              }}
              onCancel={() => {
                setOpenEndDatePicker(false);
              }}
            />
            {values.ends && (
              <Ionicons
                onPress={() => setFieldValue('ends', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}

            <Ionicons
              onPress={() => {
                setOpenEndDatePicker(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>

          <Text style={styles.title}>Nhắc nhở</Text>
          <View
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Nhắc nhở lại sau</Text>
            {/* <Dropdown
              style={{
                width: '40%',
                height: 40,
                marginBottom: 10,
                marginHorizontal: 10,
                // backgroundColor: 'yellow',
              }}
              data={times}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Chọn kỳ hạn' : '...'}
              placeholderStyle={{
                color: Colors.text.lightgrey,
              }}
              itemTextStyle={{
                color: Colors.text.grey,
              }}
              selectedTextStyle={{
                color: Colors.text.grey,
                fontWeight: 'bold',
                fontSize: 14,
              }}
              value={values.times}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setFieldValue('times', item.value);
              }}
            /> */}
            <View
              style={[
                styles.inputContainer,
                {
                  width: '25%',
                  marginHorizontal: 5,
                  paddingBottom: 0,
                },
              ]}>
              <TextInput
                onChangeText={value => setFieldValue('times', value)}
                onBlur={() => setFieldTouched('times')}
                style={[
                  styles.inputText,
                  {textAlignVertical: 'bottom', textAlign: 'center'},
                ]}
                placeholder={'Nhập chu kỳ'}
                placeholderTextColor={Colors.text.lightgrey}
                value={splitString(values.times)}
                keyboardType={'numeric'}
              />

              {/* {values.times && (
                <Ionicons
                  onPress={() => setFieldValue('times', '')}
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )} */}
            </View>
            <Text style={styles.text}>tháng</Text>
          </View>
          {touched.times && errors.times && (
            <Text style={styles.error}>{errors.times}</Text>
          )}

          <Text style={styles.title}>Tổng tiền</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => {
                setFieldValue('total', value);
                const amount = value.split('.').join('');
                console.log('amount:', amount);

                setTotalAmount(parseInt(amount));
              }}
              onBlur={() => setFieldTouched('total')}
              style={styles.inputText}
              placeholder={'Nhập tổng tiền'}
              placeholderTextColor={Colors.text.lightgrey}
              value={splitString(values.total)}
              keyboardType={'numeric'}
            />
            {values.total && (
              <Ionicons
                onPress={() => setFieldValue('total', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Text style={styles.text}>VNĐ</Text>
          </View>
          {touched.total && errors.total && (
            <Text style={styles.error}>{errors.total}</Text>
          )}

          <Text style={styles.title}>Danh sách thành viên</Text>

          {fund.members.length > 0 &&
            fund.members.map((member, index) => (
              <View
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                key={member._id}>
                <View
                  style={{
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: -5,
                    gap: 10,
                    marginBottom: 10,
                  }}>
                  <CheckBox
                    tintColors={{true: Colors.checkBox.orange}}
                    // disabled={member.role === 'Super User'}
                    disabled={false}
                    value={toggleCheckBoxArray[index]}
                    onValueChange={async newValue => {
                      handleToggleCheckBox(index, newValue);

                      console.log(newValue);
                    }}
                    style={{width: '10%'}}
                  />
                  <Text style={{color: Colors.text.grey}}>{member.name}</Text>
                </View>

                {toggleCheckBoxArray[index] && amountArray[index] !== 0 && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      gap: 5,
                    }}>
                    <Text
                      style={{
                        color: Colors.text.grey,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {splitString(amountArray[index].toString())}
                    </Text>
                    <Text>VNĐ</Text>
                  </View>
                )}
              </View>
            ))}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
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

          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Formik>
  );
};

export default FundDetailScreen;
