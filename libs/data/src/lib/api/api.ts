import axios, { AxiosRequestConfig } from 'axios';

// Example base URL, adjust as needed
const BASE_URL = process.env.API_BASE_URL || 'https://api.osint-expert.local';

// Generic GET request
export async function apiGet<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.get<T>(`${BASE_URL}${endpoint}`, config);
  return response.data;
}

// Generic POST request
export async function apiPost<T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, config);
  return response.data;
}

// Generic PUT request
export async function apiPut<T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.put<T>(`${BASE_URL}${endpoint}`, data, config);
  return response.data;
}

// Generic DELETE request
export async function apiDelete<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.delete<T>(`${BASE_URL}${endpoint}`, config);
  return response.data;
}
