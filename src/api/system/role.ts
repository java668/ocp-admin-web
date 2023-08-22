import { RoleParam, RoleRecord } from '@/types/system/Role';
import axios from 'axios';
import { HttpResponse } from '@/types/global';

export function addRole(tenantId: string, data: RoleRecord) {
  return axios.post('/api-user/users/saveOrUpdate', data, {
    params: { tenantId },
  });
}

export function page(params: RoleParam) {
  return axios.get<RoleRecord[], HttpResponse<RoleRecord[]>, RoleParam>(
    '/api-user/roles',
    {
      params,
    }
  );
}

export function listRole() {
  return axios.get<RoleRecord[], HttpResponse<RoleRecord[]>>(
    '/api-user/allRoles'
  );
}
