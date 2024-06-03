import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;

  @Expose()
  accessToken: string;
}

export class user {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;
}
export class LoginResponse {
  @Expose()
  @Type(() => user)
  user: user;

  @Expose()
  accessToken: string;
}
export class AllUserDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;
}
