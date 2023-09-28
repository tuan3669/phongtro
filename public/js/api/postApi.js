import axiosClient from './axiosClient.js';
const postApi = {
  getAll(searchParams) {
    const url = `/posts`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getAllUserPosts(searchParams) {
    const url = `/posts/getAll`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getAllByUserId(searchParams) {
    const url = `/posts/currentUser`;
    return axiosClient.get(url, {
      params: searchParams,
    });
  },
  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },
  removeById(id) {
    const url = `/posts/${id}`;
    console.log('url:' + url);
    return axiosClient.delete(url);
  },
  updatedFormData(data) {
    const url = `/posts/${data.get('id')}`;
    return axiosClient.put(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  addFormData(data) {
    const url = `/posts`;
    return axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
export default postApi;
