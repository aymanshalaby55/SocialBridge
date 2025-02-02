import { UserSetting } from '../models/userSetting';

export const userSettings: UserSetting[] = [
  {
    userId: 1,
    recivedNotif: true,
    receiveEmails: true,
  },
  {
    userId: 2,
    recivedNotif: false,
    receiveEmails: true,
  },
  {
    userId: 3,
    recivedNotif: true,
    receiveEmails: false,
  },
  {
    userId: 4,
    recivedNotif: false,
    receiveEmails: false,
  },
  {
    userId: 5,
    recivedNotif: true,
    receiveEmails: true,
  },
];
