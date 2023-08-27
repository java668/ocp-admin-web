export interface RoleParam {
  tenantId?: string | undefined;
  name?: string;
  mobile?: string;
  page: number;
  limit: number;
}
export interface RoleRecord {
  id?: string | undefined;
  createTime?: string | undefined;
  updateTime?: string | undefined;
  code: string | undefined;
  name: string | undefined;
  userId?: any;
  remarks?: string | undefined;
}

export interface RoleGranted {
  menuIds: string[];
  roleId: string;
}
