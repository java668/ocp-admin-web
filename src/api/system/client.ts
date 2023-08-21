import { RoleParam, RoleRecord } from '@/types/system/Role';
import axios from 'axios';
import { HttpResponse } from '@/types/global';
import {ClientRecord} from "@/types/system/Client";

export function listClient() {
  return axios.get<ClientRecord[], HttpResponse<ClientRecord[]>>(
    '/api-auth/clients/all'
  );
}

export function addClient() {
  return axios.get<RoleRecord[], HttpResponse<RoleRecord[]>>(
    '/api-user/allRoles'
  );
}
