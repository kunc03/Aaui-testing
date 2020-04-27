import Storage from './storage';

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const API_SERVER_DEV = 'http://localhost:3200/';
const API_SERVER_PROD = 'https://api.icademy.id/';

export const DEV_MODE = false;
export const API_SERVER = DEV_MODE ? API_SERVER_DEV : API_SERVER_PROD;

export const API_JITSI = 'meet.icademy.id';
export const API_SOCKET = "https://socket.icademy.id";

export const USER_LOGIN = `${API_SERVER}v1/auth`;
export const VOUCHER_LOGIN = `${API_SERVER}v1/auth/voucher`;
export const USER_ME = `${API_SERVER}v1/auth/me/`;
export const USER = `${API_SERVER}v1/user`;
export const FORUM = `${API_SERVER}v1/forum`;

export default class API {
    static getConfig = (bearer = true) => {
        let token = Storage.get('token');
        if(bearer){
            return {
                headers: {
                    'Authorization' : token.data,
                },
            };
        }else{
            return {
                headers: {
                    'Authorization' : token.data,
                },
            };
        }
    }

    static post = (endpoint, body, headers) => {
        let config = API.getConfig();
        
        if(headers) {
            config.headers = {...config.headers, ...headers};
        }

        return axios.post(endpoint, body, config);
    }

    static get = (endpoint, params, headers, bearer = true) => {
        let config = API.getConfig(bearer);

        if(params){
            config.params = params;
        }

        if(headers) {
            config.headers = {...config.headers, ...headers};
        }

        return axios.get(endpoint, config);
    }

    static put = (endpoint, body, params, headers, bearer = true) => {
        let config = API.getConfig(bearer);

        if(params){
            config.params = params;
        }

        if(headers){
            config.headers = {...config.headers, ...headers};
        }

        return axios.put(endpoint, body, config);
    }

    static delete = (endpoint, params, headers, bearer = true) => {
        let config = API.getConfig(bearer);

        if(params){
            config.params = params;
        }

        if(headers){
            config.headers = {...config.headers, ...headers};
        }

        return axios.delete(endpoint, config);
    }
}