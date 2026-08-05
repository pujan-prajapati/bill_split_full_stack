import axios, { type AxiosResponse, type Method } from "axios";
import { getAccessToken, setAccessToken } from "./lib/token";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshHttp = axios.create(http.defaults);

export const refreshAccessToken = async () => {
  const response = await refreshHttp.post("/user/refresh/");
  return response.data.access_token as string;
};

let refreshPromise: Promise<string> | null = null;

const getRefreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/user/login/") ||
      originalRequest.url?.includes("/user/refresh/")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/user/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getRefreshToken();

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return http(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const httpPost = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
) => {
  const response = http.post<TResponse>(url, data);
  return response;
};

export const httpDelete = async <TResponse>(url: string) => {
  const response = http.delete<TResponse>(url);
  return response;
};

export const httpPut = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
) => {
  const response = http.put<TResponse>(url, data);
  return response;
};

export const httpGet = async <T>(
  url: string,
  params?: Record<string, unknown>,
) => {
  const response = http.get<T>(url, { params: params });
  return response;
};

export const uploader = async <
  TRequest extends Record<string, unknown>,
  TResponse,
>(
  url: string,
  method: Method,
  data: TRequest,
  fieldName: string,
  file: File | File[] | null,
): Promise<AxiosResponse<TResponse>> => {
  const formData = new FormData();

  if (file) {
    if (Array.isArray(file)) {
      file.forEach((item) => {
        formData.append(fieldName, item);
      });
    } else {
      formData.append(fieldName, file);
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(value instanceof File) &&
      !(value instanceof Blob)
    ) {
      formData.append(key, String(value));
    }
  });

  return http.request<TResponse>({
    url,
    method,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
