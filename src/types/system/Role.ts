export interface RoleParam {
  tenantId?: string | undefined;
  mobile?: string;
  page: number;
  limit: number;
}
export interface RoleRecord {
  id: string;
  createTime: string;
  updateTime: string;
  code: string;
  name: string;
  userId?: any;
}
