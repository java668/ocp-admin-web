import axios from 'axios';

export interface LoginData {
  username: string;
  password: string;
  validCode: string;
  deviceId: string;
  grant_type: string;
}

export interface LoginRes {
  token: string;
}

/**
 * 用户登录
 * @param loginData
 */
export function login(loginData: LoginData) {
  const { VITE_API_CLIENT_ID, VITE_API_CLIENT_SECRET } = import.meta.env;
  const client = window.btoa(`${VITE_API_CLIENT_ID}:${VITE_API_CLIENT_SECRET}`);
  const Authorization = `Basic ${client}`;
  return axios.request<LoginRes>({
    url: '/api-auth/oauth/token',
    method: 'POST',
    data: loginData,
    transformRequest: [
      (data) => {
        let ret = '';
        Object.keys(data).forEach((key) => {
          // 获取到属性对应的值，做一些处理
          ret += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
        });
        return ret;
      },
    ],
    headers: {
      Authorization,
    },
  });
}
