/**
 * {
 *     "statusCodeValue": 0,
 *     "msg": "",
 *     "datas": {
 *         "id": "1",
 *         "createTime": "2017-11-17T08:56:59.000+00:00",
 *         "updateTime": "2019-01-08T09:05:47.000+00:00",
 *         "username": "admin",
 *         "password": "$2a$10$TJkwVdlpbHKnV45.nBxbgeFHmQRmyWlshg94lFu2rKxVtT2OMniDO",
 *         "nickname": "**员",
 *         "headImgUrl": "http://rhsvhgzxz.hd-bkt.clouddn.com/2022/09/07/0F1D7905452E44729C170E68EEA9252A.jpeg",
 *         "mobile": "18888888888",
 *         "sex": 0,
 *         "enabled": true,
 *         "type": "APP",
 *         "openId": "o-GSeppS8mNI6yFBgrScoQSbmqBtvAq",
 *         "roles": [
 *             {
 *                 "id": "1",
 *                 "createTime": "2017-11-17T08:56:59.000+00:00",
 *                 "updateTime": "2018-09-19T01:39:10.000+00:00",
 *                 "code": "ADMIN",
 *                 "name": "管理员",
 *                 "userId": null
 *             }
 *         ],
 *         "roleId": null,
 *         "oldPassword": null,
 *         "newPassword": null,
 *         "permissions": [
 *             "user-btn-add",
 *             "user-list",
 *             "user-roles",
 *             "user-btn-export",
 *             "user-btn-import"
 *         ],
 *         "userId": "o-GSeppS8mNI6yFBgrScoQSbmqBtvAq",
 *         "accountNonExpired": true,
 *         "credentialsNonExpired": true,
 *         "accountNonLocked": true,
 *         "del": false
 *     }
 * }
 */

/**
 * 用户信息
 */
export interface UserInfoRoles {
  id: string;
  createTime: string;
  updateTime: string;
  code: string;
  name: string;
  userId?: any;
}

export interface UserInfo {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  nickname: string;
  headImgUrl: string;
  mobile: string;
  sex: number;
  enabled: boolean;
  type: string;
  openId: string;
  roles: UserInfoRoles[];
  roleId?: any;
  oldPassword?: any;
  newPassword?: any;
  permissions: string[];
  userId: string;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  del: boolean;
}
