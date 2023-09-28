import axiosClient from './axiosClient.js';
const packageApi = {
  getAll(searchParams) {
    const url = `/packages`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getById(id) {
    const url = `/packages/${id}`;
    return axiosClient.get(url);
  },
  removeById(id) {
    const url = `/packages/${id}`;
    console.log('url:' + url);
    return axiosClient.delete(url);
  },
  update(data) {
    const url = `/packages/${data.id}`;
    return axiosClient.put(url, data);
  },
  add(data) {
    const url = `/packages`;
    return axiosClient.post(url, data);
  },
};
export default packageApi;
