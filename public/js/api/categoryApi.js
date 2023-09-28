import axiosClient from './axiosClient.js';

const categoryApi = {
  getAll() {
    const url = `/categories`;
    return axiosClient.get(url);
  },
  getById(id) {
    const url = `/categories/${id}`;
    return axiosClient.get(url);
  },
  removeById(id) {
    const url = `/categories/${id}`;
    console.log('url:' + url);
    return axiosClient.delete(url);
  },
  update(data) {
    const url = `/categories/${data.id}`;
    return axiosClient.put(url, data);
  },
  add(data) {
    const url = `/categories`;
    return axiosClient.post(url, data);
  },
};
export default categoryApi;
