import axios from 'axios';

export default {
  install: (app) => {
    const instance = axios.create({
      baseURL: import.meta.env.VUE_APP_API_BASE_URL,
      withCredentials: true
    });

    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      response => {
        return response;
      }, 
      error => {
        return Promise.reject(error);
      }
    );

    console.log(instance);
    app.config.globalProperties.$axios = instance;
    app.provide('axios', instance);
  }
};