import axios from 'axios';
import { UserRecord, UserParam } from '@/types/system/User';
import { HttpResponse } from '@/types/global';

export function addUser(data: UserRecord) {
  return axios.post<any, HttpResponse<any>, UserRecord>(
    '/api-user/users/saveOrUpdate',
    data
  );
}

export function deleteUser(userId: number) {
  return axios.delete<any, HttpResponse<any>, number>(
    `/api-user/users/${userId}`
  );
}

export function updateUser(data: UserRecord) {
  return axios.post<any, HttpResponse<any>, UserRecord>(
    '/api-user/users/saveOrUpdate',
    data
  );
}

export function getUser(userId: number) {
  return axios.get<UserRecord, HttpResponse<UserRecord>>(
    '/api-user/users-anon/userId',
    {
      params: { userId },
    }
  );
}

export function page(params: UserParam) {
  return axios.get<UserRecord[], HttpResponse<UserRecord[]>, UserParam>(
    '/api-user/users',
    {
      params,
    }
  );
}

export function restPass(userId: number) {
  return axios.put<any, HttpResponse<any>, UserRecord>(
    `/api-user/users/${userId}/password`
  );
}

export function updateEnabled(params: { id: number; enabled: boolean }) {
  return axios.get<any, HttpResponse<any>>(`/api-user/users/updateEnabled`, {
    params,
  });
}
