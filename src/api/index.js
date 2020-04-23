import request from '../utils/request';

//登陆接口
export const login = query => {
    return request({
        url: '/home/user-login',
        method: 'post',
        params: query
    });
};

