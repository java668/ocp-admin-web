import axios from 'axios';
import queryString from 'query-string';
import { HttpResponse } from '@/types/global';
import { UserInfo } from '@/store/modules/user/UserInfo';

type GrantType = 'password_code' | 'password';

export interface LoginData {
  username: string;
  password: string;
  validCode: string;
  deviceId: string;
  grant_type: GrantType;
}

export interface LoginRes {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  tenantId: string;
  license: string;
  account_type: string;
  client_ip: string;
}

const { VITE_API_CLIENT_ID, VITE_API_CLIENT_SECRET } = import.meta.env;

/**
 * 用户
 * @param loginData
 */
export function userLogin(loginData: LoginData) {
  const client = window.btoa(`${VITE_API_CLIENT_ID}:${VITE_API_CLIENT_SECRET}`);
  const Authorization = `Basic ${client}`;

  return axios.request<LoginRes, HttpResponse<LoginRes>, LoginData>({
    url: '/api-auth/oauth/token',
    method: 'POST',
    data: loginData,
    transformRequest: [
      (data) => {
        return queryString.stringify(data);
      },
    ],
    headers: {
      Authorization,
    },
  });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return axios.get<UserInfo, HttpResponse<UserInfo>, any>(
    '/api-user/users/current'
  );
}
