import { v4 as uuidv4 } from 'uuid';

const TOKEN_KEY = 'token';
const DEVICE_ID_KEY = 'deviceId';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getDeviceId = (): string | null => {
  const deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (deviceId) {
    return deviceId;
  }
  const uuid: string = uuidv4();
  localStorage.setItem(DEVICE_ID_KEY, uuid);
  return uuid;
};

export { isLogin, getToken, setToken, clearToken, getDeviceId };
