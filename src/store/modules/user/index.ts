import { defineStore } from 'pinia';
import { logout as userLogout } from '@/api/user';

import { userLogin, getUserInfo, LoginData } from '@/api/auth/auth';

import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserInfo } from '@/store/modules/user/UserInfo';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: '1',
    createTime: '2017-11-17T08:56:59.000+00:00',
    updateTime: '2019-01-08T09:05:47.000+00:00',
    username: 'admin',
    password: '$2a$10$TJkwVdlpbHKnV45.nBxbgeFHmQRmyWlshg94lFu2rKxVtT2OMniDO',
    nickname: '**员',
    headImgUrl:
      'http://rhsvhgzxz.hd-bkt.clouddn.com/2022/09/07/0F1D7905452E44729C170E68EEA9252A.jpeg',
    mobile: '18888888888',
    sex: 0,
    enabled: true,
    type: 'APP',
    openId: 'o-GSeppS8mNI6yFBgrScoQSbmqBtvAq',
    roles: [
      {
        id: '1',
        createTime: '2017-11-17T08:56:59.000+00:00',
        updateTime: '2018-09-19T01:39:10.000+00:00',
        code: 'ADMIN',
        name: '管理员',
        userId: null,
      },
    ],
    roleCodes: undefined,
    roleId: null,
    oldPassword: null,
    newPassword: null,
    permissions: [
      'user-btn-add',
      'user-list',
      'user-roles',
      'user-btn-export',
      'user-btn-import',
    ],
    userId: 'o-GSeppS8mNI6yFBgrScoQSbmqBtvAq',
    accountNonExpired: true,
    credentialsNonExpired: true,
    accountNonLocked: true,
    del: false,
  }),

  getters: {
    userInfo(state: UserInfo): UserInfo {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'admin' : 'user';
        // resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserInfo>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      const { datas } = res;
      datas.roleCodes = datas?.roles?.map((item) => item.code);
      this.setInfo(datas);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
