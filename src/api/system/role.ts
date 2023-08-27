import { RoleGranted, RoleParam, RoleRecord } from '@/types/system/Role';
import axios from 'axios';
import { HttpResponse } from '@/types/global';

export function addRole(tenantId: string, data: RoleRecord) {
  return axios.post<RoleRecord, HttpResponse<RoleRecord>>(
    `/api-user/roles/saveOrUpdate?tenantId=${tenantId}`,
    data
  );
}

export function deleteRole(tenantId: string, id: string) {
  return axios.delete<any, HttpResponse<any>>(
    `/api-user/roles/${id}?tenantId=${tenantId}`
  );
}

export function updateRole(tenantId: string, data: RoleRecord) {
  return axios.post<RoleRecord, HttpResponse<RoleRecord>>(
    `/api-user/roles/saveOrUpdate?tenantId=${tenantId}`,
    data
  );
}

export function getRole(id: string) {
  return axios.get<RoleRecord, HttpResponse<RoleRecord>>(
    `/api-user/roles/${id}`
  );
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

export function granted(data: RoleGranted, tenantId: string) {
  return axios.post<RoleGranted, HttpResponse<RoleGranted>>(
    `/api-user/menus/granted?tenantId=${tenantId}`,
    data
  );
}
