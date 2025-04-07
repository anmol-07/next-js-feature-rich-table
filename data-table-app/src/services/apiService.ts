import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // JSON server base URL
});

export const apiService = {
  get: (url: string, params = {}) => instance.get(url, { params }).then((res) => res.data),
  post: (url: string, data = {}) => instance.post(url, data).then((res) => res.data),
  put: (url: string, data = {}) => instance.put(url, data).then((res) => res.data),
  delete: (url: string) => instance.delete(url).then((res) => res.data),
};
