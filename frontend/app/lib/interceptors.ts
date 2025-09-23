import {api, refresh} from "./api";
import {AxiosError} from "axios";


declare module "axios" {
  export interface InternalAxiosRequestConfig {
    sent?: boolean;
  }
}

export const onError = async (error: AxiosError) => {
  console.error('Full error object:', error);

  if (error?.response) {
    console.error('API error response:', {
      url: error.config?.url,
      status: error.response.status,
      data: error.response.data,
    });
    if (error.response.status === 401 && !error.config?.sent) {
      error.config!.sent = true;
      await refresh();
      return api(error.config!);
    }
    if (error.response.status === 404) {
      console.error('Resource not found (404):', {
        url: error.config?.url,
        data: error.response.data,
      });
    }
  } else if (error?.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
  return Promise.reject(error);
};


