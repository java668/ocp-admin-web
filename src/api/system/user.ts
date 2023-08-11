import axios from 'axios';
import { User, UserPage, UserPageParam } from '@/types/system/User';
import { HttpResponse } from '@/types/global';

export function addUser(data: User) {
  return axios.post('/api-user/users/saveOrUpdate', data);
}

export function deleteUser(userId: number) {
  return axios.delete(`/api-user/users/${userId}`);
}

export function updateUser(data: User) {
  return axios.post('/api-user/users/saveOrUpdate', data);
}

export function page(params: UserPageParam) {
  return axios.get<UserPage[], HttpResponse<UserPage[]>, UserPageParam>(
    '/api-user/users',
    {
      params,
    }
  );
}
