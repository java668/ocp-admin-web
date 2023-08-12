import { RoleRecord } from '@/types/system/Role';
import axios from 'axios';
import { HttpResponse } from '@/types/global';

export function addRole(data: RoleRecord) {
  return axios.post('/api-user/users/saveOrUpdate', data);
}

export function listRole() {
  return axios.get<RoleRecord[], HttpResponse<RoleRecord[]>>(
    '/api-user/allRoles'
  );
}
