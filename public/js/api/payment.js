// create_payment_url;
// create_payment_url;

import axiosClient from './axiosClient.js';
const paymentApi = {
  add(data) {
    const url = `/payment/createPayment`;
    return axiosClient.post(url, data);
  },
};
export default paymentApi;
