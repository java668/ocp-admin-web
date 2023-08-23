import axios from 'axios';
import { HttpResponse } from '@/types/global';
import { MenuRecord } from '@/types/system/Menu';

export default function listMenu() {
  return axios.get<MenuRecord[], HttpResponse<MenuRecord[]>>(
    '/api-user/menus/21/menus?tenantId=webApp'
  );
}
