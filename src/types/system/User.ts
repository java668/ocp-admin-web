export interface User {
  id?: string;
  username: string;
  nickname: string;
  mobile: string;
  sex: string;
  roleId: string;
}

export interface UserPageParam {
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

export interface UserPage {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  nickname: string;
  headImgUrl?: any;
  mobile: string;
  sex: number;
  enabled: boolean;
  type: string;
  openId?: any;
  roles: UserPageRoles[];
  roleId?: any;
  oldPassword?: any;
  newPassword?: any;
  del: boolean;
}
