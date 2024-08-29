import { User } from '../models/user.model';

export interface ChargeUsersResponse {
  ok: boolean;
  users: User[];
}

export interface ChargeUserResponse {
  ok: boolean;
  user: User;
}
