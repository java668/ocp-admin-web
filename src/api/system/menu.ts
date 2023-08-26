import axios from 'axios';
import { HttpResponse } from '@/types/global';
import { MenuRecord } from '@/types/system/Menu';

export default function listMenu(id: string, appId: string) {
  return axios.get<MenuRecord[], HttpResponse<MenuRecord[]>>(
    `/api-user/menus/${id}/menus?tenantId=${appId}`
  );
}
