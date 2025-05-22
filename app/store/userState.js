import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    userId: '',
    userName: '사용자',
    token: '',
    isLoggedIn: false,
  },
});