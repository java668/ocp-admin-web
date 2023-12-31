export interface UserParam {
  username?: string;
  nickname?: string;
  mobile?: string;
  page: number;
  limit: number;
}

export interface UserPageRoles {
  id: string;
  createTime: string;
  updateTime: string;
  code: string;
  name: string;
  userId: string;
}

export interface UserRecord {
  id?: string;
  createTime?: string;
  updateTime?: string;
  username?: string;
  password?: string;
  nickname?: string;
  headImgUrl?: any;
  mobile?: string;
  sex?: number;
  enabled?: boolean;
  type?: string;
  openId?: any;
  roles?: UserPageRoles[];
  roleId?: any;
  oldPassword?: any;
  newPassword?: any;
  del?: boolean;
}
