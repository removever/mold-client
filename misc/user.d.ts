import { License } from './auth'

export type User = {
  user_id: string;
  license_id: string;
  user_name: string;
  user_lastname: string;
  user_mobile: string;
  user_email: string;
  user_username: string;
  user_password: string;
  user_address: string;
  user_img: string;
  user_status: string;
  images?: { user_img: { src: string, name: string } };
  license?: License;
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};

export type UserPosition = {
  user_position_id: string;
  user_position_name: string;
  addby?: string,
  adddate?: Date,
  updateby?: string,
  lastupdate?: string,
};