import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL_HOST} from '../../../../../../core/config/api/api.config';

/**
 * Get bill info by bill id
 * @param billId
 * @return response containing data from server
 */
export const getBillInfo = async (billId: string) => {
  const billEndpoint = `api/pkg-mgmt/bill/${billId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Get bill info:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Get bill info error: ', error);
  }
};

/**
 * Update bill info
 * @param billId
 * @param bill
 * @return response from server
 */
export const updateBillInfo = async (
  billId: string,
  bill: {
    summary: string;
    date: string;
    borrowers: {
      borrower: string;
      amount: number;
    }[];
    lender: string;
    description: string;
  },
) => {
  const billEndpoint = `api/pkg-mgmt/bill/${billId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Update bill:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        summary: bill.summary,
        date: bill.date,
        borrowers: bill.borrowers,
        lender: bill.lender,
        description: bill.description,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Update bill error: ', error);
  }
};

/**
 * Delete bill by id
 * @param billId
 * @return response from server
 */
export const deleteBill = async (billId: string) => {
  const billEndpoint = `api/pkg-mgmt/bill/${billId}`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log('Delete bill:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Delete bill response:', response.data);

    return response.data;
  } catch (error) {
    console.log('Delete bill error: ', error);
  }
};

/**
 * Update borrowes's status
 * @param billId
 * @param borrowers
 * @return response from server
 */
export const updateBorrowerStatus = async (billId: string, borrowers: any) => {
  const billEndpoint = `api/pkg-mgmt/bill/${billId}/status`;
  const reqUrl = `${URL_HOST}${billEndpoint}`;
  console.log("Update borrowes's status:", reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        borrowers: borrowers,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Delete bill error: ', error);
  }
};
