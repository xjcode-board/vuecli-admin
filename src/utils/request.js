import axios from 'axios';
import { Message } from 'element-ui';
const apiUrl = process.env.VUE_APP_API || '';
const service = axios.create({
    baseURL: apiUrl + '/leletong-manager',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

service.interceptors.request.use(
    config => {
        if (localStorage.getItem('userInfo')) {
            let sessionId = JSON.parse(localStorage.getItem('userInfo')).sessionId;
            //将sessionId放到请求头发送给服务器
            config.headers.sessionId = sessionId;
            return config;
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Message.error('网络繁忙，请稍后重试');
            Promise.reject();
        }
    },
    error => {
        Message.error(error);
        return Promise.reject();
    }
);

export default service;
