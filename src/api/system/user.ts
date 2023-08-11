import axios from 'axios';
import { UserRecord, UserPage, UserParam } from '@/types/system/User';
import { HttpResponse } from '@/types/global';

export function addUser(data: UserRecord) {
  return axios.post('/api-user/users/saveOrUpdate', data);
}

export function deleteUser(userId: number) {
  return axios.delete(`/api-user/users/${userId}`);
}

export function updateUser(data: UserRecord) {
  return axios.post('/api-user/users/saveOrUpdate', data);
}

export function page(params: UserParam) {
  return axios.get<UserPage[], HttpResponse<UserPage[]>, UserParam>(
    '/api-user/users',
    {
      params,
    }
  );
}
