import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://hmsback-production.up.railway.app';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
