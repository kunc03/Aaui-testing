import Storage from './storage';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const APPS_SERVER_DEV = 'http://localhost:3000/';
const APPS_SERVER_STG = 'https://app.icademy.stg.kelola.co.id/';
const APPS_SERVER_PROD = 'https://app.icademy.id/';

const API_SERVER_DEV = 'http://localhost:3200/';
const API_SERVER_STG = 'https://api.icademy.stg.kelola.co.id/';
const API_SERVER_PROD = 'https://api.icademy.id/';

export const DEV_MODE = 'development';
export const API_SERVER = DEV_MODE === 'development' ? API_SERVER_DEV : DEV_MODE === 'staging' ? API_SERVER_STG : API_SERVER_PROD;
export const APPS_SERVER = DEV_MODE === 'development' ? APPS_SERVER_DEV : DEV_MODE === 'staging' ? APPS_SERVER_STG : APPS_SERVER_PROD;

export const API_JITSI = 'meet.icademy.id';
export const API_SOCKET = "https://socket.icademy.id";

export const BBB_URL = "https://con.icademy.id/bigbluebutton/";
export const BBB_KEY = "4fXLSWqBe6AqYaBPlSbHa1BNEPhMMfctlzmG0WcFdw";

export const BBB_SERVER_LIST = [
  { server: 'https://con.icademy.id/bigbluebutton/', key: '4fXLSWqBe6AqYaBPlSbHa1BNEPhMMfctlzmG0WcFdw' },
  { server: 'https://manager.bigbluemeeting.com/bigbluebutton/', key: '9LtSXn4QcsiyWU0UEXirBJMUuSXgltFEHcCBOYAat0' },
  // { server: 'https://con1.icademy.id/bigbluebutton/', key: 'bemKTwkzELgFHhrmy0YstNLhBIvHumXJAK8s8DZrvYc' }
]

export const CHIME_URL = `https://ftabz8v877.execute-api.ap-southeast-1.amazonaws.com/Prod`;
export const ZOOM_URL = `https://z.icademy.stg.kelola.co.id`;

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

    if (endpoint.search('/auth/me/') > -1) {
      let companyId = Storage.get('companyID');

      if (typeof companyId != 'number') {
        companyId = null
      }

      config.headers.currentposition = companyId;
      console.log('TEST PAK EKO')
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



// productioin
// const APPS_SERVER_DEV = 'http://localhost:3000/';
// const APPS_SERVER_STG = 'https://app.icademy.stg.kelola.co.id/';
// const APPS_SERVER_PROD = 'https://app.icademy.dev.kelola.co.id/';

// const API_SERVER_DEV = 'http://localhost:3200/';
// const API_SERVER_STG = 'https://api.icademy.stg.kelola.co.id/';
// const API_SERVER_PROD = 'https://api.icademy.dev.kelola.co.id/';

// export const DEV_MODE = 'pro';
// export const API_SERVER = DEV_MODE === 'development' ? API_SERVER_DEV : DEV_MODE === 'staging' ? API_SERVER_STG : API_SERVER_PROD;
// export const APPS_SERVER = DEV_MODE === 'development' ? APPS_SERVER_DEV : DEV_MODE === 'staging' ? APPS_SERVER_STG : APPS_SERVER_PROD;
