import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {View, Text, Image} from 'react-native';
// import DatePicker from "react-native-modern-datepicker";
// import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

import styles from './styles/styles';
import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';
import {register} from './services/register.service';
import {IRegisterReq} from './interfaces/register.interface';

const RegisterSchema = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập họ và tên'),
	email: Yup.string()
		.email('Email không hợp lệ')
		.required('Vui lòng nhập email'),
	password: Yup.string()
		.min(6, 'Mật khẩu chứa ít nhất 8 kí tự')
		.required('Vui lòng nhập mật khẩu'),
	phone: Yup.string()
		.max(10, 'Số điện thoại không hợp lệ')
		.matches(/^(\+84)|0([3|5|7|8|9])(\d{8})$/, 'Số điện thoại không hợp lệ')
		.required('Vui lòng nhập số điện thoại'),
	dob: Yup.string().required('Vui lòng chọn ngày sinh'),
});

export default function RegisterScreen({navigation}: {navigation: any}) {
	const [hidePassword, setHidePassword] = React.useState(true);
	const [date, setDate] = React.useState(new Date());
	const [open, setOpen] = React.useState(false);

	return (
		<Formik
			initialValues={{
				name: '',
				email: '',
				password: '',
				phone: '',
				dob: '',
			}}
			validationSchema={RegisterSchema}
			onSubmit={values => {
				const dobISOString = moment(
					values.dob,
					'DD/MM/YYYY',
				).toISOString();

				console.log(dobISOString);
				// same shape as initial values
				console.log(values);
				// register({
				// 	name: values.name,
				// 	email: values.email,
				// 	password: values.password,
				// 	phone: values.phone,
				// 	dob: dobISOString,
				// }).then((response: IRegisterReq) => {
				// 	console.log(response.dob);
				// });
			}}>
			{({
				values,
				errors,
				touched,
				setFieldTouched,
				setFieldValue,
				isValid,
				handleChange,
				handleSubmit,
			}) => (
				<View style={styles.container}>
					<Text style={styles.title}>Đăng ký</Text>
					<View style={[styles.inputContainer]}>
						<TextInput
							onChangeText={value => setFieldValue('name', value)}
							onBlur={() => setFieldTouched('name')}
							style={{flex: 1}}
							placeholder={'Họ và tên'}
							value={values.name}
						/>

						{values.name && (
							<Icon
								onPress={() => setFieldValue('name', '')}
								name={'close'}
								style={styles.inputIcon}></Icon>
						)}
					</View>
					{touched.name && errors.name && (
						<Text style={styles.error}>{errors.name}</Text>
					)}

					<View style={[styles.inputContainer]}>
						<TextInput
							onChangeText={value =>
								setFieldValue('email', value)
							}
							onBlur={() => setFieldTouched('email')}
							style={{flex: 1}}
							placeholder={'Email'}
							value={values.email}
							keyboardType="email-address"
						/>

						{values.email && (
							<Icon
								onPress={() => setFieldValue('email', '')}
								name={'close'}
								style={styles.inputIcon}></Icon>
						)}
					</View>
					{touched.email && errors.email && (
						<Text style={styles.error}>{errors.email}</Text>
					)}

					<View style={styles.inputContainer}>
						<TextInput
							onChangeText={value =>
								setFieldValue('password', value)
							}
							onBlur={() => setFieldTouched('password')}
							secureTextEntry={hidePassword}
							placeholder={'Mật khẩu'}
							style={{flex: 1}}
							value={values.password}
						/>
						{values.password && (
							<Icon
								onPress={() => setFieldValue('password', '')}
								name={'close'}
								style={[styles.inputIcon, {marginRight: 10}]}
							/>
						)}
						<Icon
							onPress={() => setHidePassword(!hidePassword)}
							name={hidePassword ? 'eye' : 'eye-off'}
							style={styles.inputIcon}></Icon>
					</View>
					{touched.password && errors.password && (
						<Text style={[styles.error]}>{errors.password}</Text>
					)}

					<View style={[styles.inputContainer]}>
						<TextInput
							onChangeText={value =>
								setFieldValue('phone', value)
							}
							onBlur={() => setFieldTouched('phone')}
							style={{flex: 1}}
							placeholder={'Số điện thoại'}
							value={values.phone}
							keyboardType="phone-pad"
						/>

						{values.phone && (
							<Icon
								onPress={() => setFieldValue('phone', '')}
								name={'close'}
								style={styles.inputIcon}></Icon>
						)}
					</View>
					{touched.phone && errors.phone && (
						<Text style={styles.error}>{errors.phone}</Text>
					)}

					<View style={[styles.inputContainer]}>
						<TextInput
							editable={false}
							// onChangeText={value => setFieldValue('dob', value)}
							onBlur={() => setFieldTouched('dob')}
							style={{flex: 1, color: 'black'}}
							placeholder={'Ngày sinh'}
							value={values.dob}
						/>

						<DatePicker
							modal
							open={open}
							date={date}
							mode={'date'}
							locale={'vi'}
							onConfirm={value => {
								console.log(value);

								setOpen(false);
								setDate(value);
								// setFieldValue('dob', value);
								setFieldValue(
									'dob',
									moment(value).format('DD/MM/YYYY'),
								);
							}}
							onCancel={() => {
								setOpen(false);
							}}
						/>

						{values.dob && (
							<Icon
								onPress={() => setFieldValue('dob', '')}
								name={'close'}
								style={[
									styles.inputIcon,
									{marginRight: 10},
								]}></Icon>
						)}
						<Icon
							onPress={() => {
								setOpen(true);
							}}
							name={'calendar'}
							style={styles.inputIcon}></Icon>
					</View>

					{errors.dob && (
						<Text style={styles.error}>{errors.dob}</Text>
					)}

					<TouchableOpacity
						onPress={handleSubmit}
						disabled={!isValid}
						style={[
							styles.button,
							{
								backgroundColor: isValid
									? Colors.primary
									: Colors.disabled,
							},
						]}>
						<Text style={styles.textButton}>Đăng ký</Text>
					</TouchableOpacity>

					<View style={styles.dividerContainer}>
						<View style={styles.divider} />
						<Text style={styles.textDivider}>Hoặc</Text>
						<View style={styles.divider} />
					</View>

					<TouchableOpacity style={styles.socialButton}>
						<Image
							source={require('../../../../assets/google.png')}
							style={{...styles.socialButton.image}}
						/>
						<Text style={styles.text}>Tiếp tục với Google</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialButton}>
						<Image
							source={require('../../../../assets/facebook.png')}
							style={{...styles.socialButton.image}}
						/>
						<Text style={styles.text}>Tiếp tục với Facebook</Text>
					</TouchableOpacity>
					<View style={styles.flexRow}>
						<Text style={styles.textPrimary}>Đã có tài khoản?</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(
									RouteNames.LOGIN as never,
									{} as never,
								);
								console.log('đăng nhập');
							}}>
							<Text
								style={[
									styles.textPrimary,
									styles.loginPrimary,
								]}>
								Đăng nhập
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</Formik>
	);
}
