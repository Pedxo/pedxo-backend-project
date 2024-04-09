import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { comparedHashed, HashData } from 'src/common/hashed/hashed.data';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from '../user/dto/login.user.dto';
import { UserService } from 'src/user/user.service';
import { OtpService } from '../otp/service/otp.service';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto/auth.dto';
import { OtpType } from 'src/otp/enum/opt.type.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private otpService: OtpService,
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

  async verifyEmail(payload: VerifyEmailDto) {
    const { email, code } = payload;

    const user = await this.userService.getByEmail(email);

    await this.otpService.verifyOTP({ email, code });

    if (user.isEmailVerified) {
      throw new BadRequestException('Your account is verify already');
    }

    user.isEmailVerified = true;

    await user.save();

    return user;
  }

  async forgotPassword(payload: ForgetPasswordDto) {
    const { email } = payload;
    await this.userService.getByEmail(email);
    await this.otpService.sendOtp({
      email: email,
      type: OtpType.RESET_PASSWORD,
    });
    return `Otp send, kindly check your email`;
  }

  async resetPassword(
    payload: VerifyForgetPasswordDto,
    passwordInput: ResetPasswordDto,
  ) {
    const { email, code } = payload;
    const { password } = passwordInput;

    const user = await this.userService.getByEmail(email);
    await this.otpService.verifyOTP({ email, code });

    const hashedPassword = await HashData(password);
    user.password = hashedPassword;

    await user.save();

    return `Password Change Successfully`;
  }
}
