import axios from 'axios';
import { API_BASE_URL as baseURL } from '../config/constants';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});