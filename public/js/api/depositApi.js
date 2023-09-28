import axiosClient from './axiosClient.js';
const depositApi = {
  getAll(searchParams) {
    const url = `/depositHistory`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getById(id) {
    const url = `/depositHistory/${id}`;
    return axiosClient.get(url);
  },
};
export default depositApi;
