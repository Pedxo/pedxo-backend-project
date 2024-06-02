import { Expose } from 'class-transformer';

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
