import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { HashData, comparedHashed } from 'src/common/hashed/hashed.data';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from '../user/dto/login.user.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  //sign up account endpoint
  async create(body: CreateUserDTO) {
    const { email, userName } = body;

    const userExist = await this.userService.getByEmailOrUserName(
      email,
      userName,
    );

    if (userExist) {
      if (userExist.email === email && userExist.userName === userName) {
        throw new UnprocessableEntityException(
          'email and username already exist',
        );
      }

      if (userExist.email === email) {
        throw new UnprocessableEntityException('email already exist');
      }
      if (userExist.userName === userName) {
        throw new UnprocessableEntityException('username already exist');
      }
    }

    return await this.userService.create(body);
  }

  //Log in endpoint
  async login(body: LoginUserDTO) {
    const { email, password } = body;
    const user = await this.userService.getByEmailOrUserName(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if ((await comparedHashed(password, user.password)) === false) {
      throw new BadRequestException('password do not matched');
    }

    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const token = await this.jwt.signAsync(payload);
    return token;
  }
}
