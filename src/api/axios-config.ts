import axios from 'axios';

const token = localStorage.getItem('token');
let authorization;
if (token) authorization = `Bearer ${token}`;

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: authorization,
  },
});

export default api;
