import Storage from './storage';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const APPS_SERVER_DEV = 'http://localhost:3000/';
const APPS_SERVER_STG = 'https://app.icademy.mooo.com/';
const APPS_SERVER_PROD = 'https://app.icademy.id/';

const API_SERVER_DEV = 'http://localhost:3200/';
const API_SERVER_STG = 'https://api.icademy.mooo.com/';
const API_SERVER_PROD = 'https://api.icademy.id/';

export const DEV_MODE = 'development';
export const API_SERVER = DEV_MODE === 'development' ? API_SERVER_DEV : DEV_MODE === 'staging' ? API_SERVER_STG : API_SERVER_PROD;
export const APPS_SERVER = DEV_MODE === 'development' ? APPS_SERVER_DEV : DEV_MODE === 'staging' ? APPS_SERVER_STG : APPS_SERVER_PROD;

export const API_JITSI = 'meet.icademy.id';
export const API_SOCKET = "https://socket.icademy.mooo.com";

export const BBB_URL = "https://conference.icademy.id/bigbluebutton/";
export const BBB_KEY = "pzHkONB47UvPNFQU2fUXPsifV3HHp4ISgBt9W1C0o";

export const USER_LOGIN = `${API_SERVER}v1/auth`;
export const VOUCHER_LOGIN = `${API_SERVER}v1/auth/voucher`;
export const USER_ME = `${API_SERVER}v1/auth/me/`;
export const USER = `${API_SERVER}v1/user`;
export const FORUM = `${API_SERVER}v1/forum`;

export default class API {
  static getConfig = (bearer = true) => {
    let token = Storage.get('token');
    if (bearer) {
      return {
        headers: {
          Authorization: token.data,
        },
      };
    } else {
      return {
        headers: {
          Authorization: token.data,
        },
      };
    }
  };

  static post = (endpoint, body, headers) => {
    let config = API.getConfig();

    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }

    return axios.post(endpoint, body, config);
  };

  static get = (endpoint, params, headers, bearer = true) => {
    let config = API.getConfig(bearer);

    if (params) {
      config.params = params;
    }

    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }

    return axios.get(endpoint, config);
  };

  static put = (endpoint, body, params, headers, bearer = true) => {
    let config = API.getConfig(bearer);

    if (params) {
      config.params = params;
    }

    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }

    return axios.put(endpoint, body, config);
  };

  static delete = (endpoint, params, headers, bearer = true) => {
    let config = API.getConfig(bearer);

    if (params) {
      config.params = params;
    }

    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }

    return axios.delete(endpoint, config);
  };
}

