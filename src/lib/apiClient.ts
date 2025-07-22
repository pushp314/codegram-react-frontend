// This file sets up our Axios instance.
// All API requests will go through this client, making it easy to
// add interceptors for handling auth tokens or errors globally.

import axios from 'axios'
import { API_BASE_URL } from '../config/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies with requests
});
