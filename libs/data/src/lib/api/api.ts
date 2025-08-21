import axios, { AxiosRequestConfig } from 'axios';

const apiBaseUrl = 'http://localhost:3333/api';
//export const apiBaseUrl = process.env.API_BASE_URL!;
//export const featureFlag = process.env.FEATURE_FLAG === 'true';

// Generic GET request
export async function apiGet<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  console.log(`API URL: ${apiBaseUrl}`);
  const response = await axios.get<T>(`${apiBaseUrl}${endpoint}`, config);
  return response.data;
}

// Generic POST request
export async function apiPost<T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.post<T>(
    `${apiBaseUrl}${endpoint}`,
    data,
    config
  );
  return response.data;
}

// Generic PUT request
export async function apiPut<T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.put<T>(`${apiBaseUrl}${endpoint}`, data, config);
  return response.data;
}

// Generic DELETE request
export async function apiDelete<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.delete<T>(`${apiBaseUrl}${endpoint}`, config);
  return response.data;
}
