import axiosClient from './axiosClient.js';
const userApi = {
  getAll(searchParams) {
    const url = `/users`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getById(id) {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  getCurentUser() {
    const url = `/users/curent`;
    return axiosClient.get(url);
  },
  removeById(id) {
    const url = `/users/${id}`;
    console.log('url:' + url);
    return axiosClient.delete(url);
  },
};
export default userApi;
