const axiosLocation = axios.create({
  baseURL: 'https://provinces.open-api.vn/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a response interceptor
axiosLocation.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// province;
// ward;
// district;

const locationApi = {
  getProvince() {
    const url = `/`;
    return axiosLocation.get(url);
  },
  getDistrict(provinceValue) {
    const url = `/p/${provinceValue}?depth=2`;
    return axiosLocation.get(url);
  },
  getWard(districtValue) {
    const url = `/d/${districtValue}?depth=2`;
    return axiosLocation.get(url);
  },
};
export default locationApi;
