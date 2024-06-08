import {
  BadRequestException,
  ForbiddenException,
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
  AccessTokenDto,
  ForgetPasswordDto,
  RequestOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto/auth.dto';
import { OtpType } from 'src/otp/enum/opt.type.enum';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

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
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if ((await comparedHashed(password, user.password)) === false) {
      throw new BadRequestException('password do not matched');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'You have to verify you account before logging in',
      );
    }

    const token = await this.token(user);

    const accessToken = token.accessToken;

    return {
      user,
      accessToken,
    };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const { email, code } = payload;

    const user = await this.userService.getByEmail(email);

    await this.otpService.verifyOTP({
      email: email,
      code: code,
      type: OtpType.EMAIL_VERIFICATION,
    });

    if (user.isEmailVerified) {
      throw new BadRequestException('Your account is verify already');
    }

    user.isEmailVerified = true;

    await user.save();

    return 'Account is now verified';
  }

  async forgotPassword(payload: ForgetPasswordDto) {
    const { email } = payload;

    const user = await this.userService.getByEmail(email);

    await this.otpService.sendOtp({
      email: email,
      type: OtpType.RESET_PASSWORD,
      userName: user.userName,
    });

    return `Otp send, kindly check your email`;
  }

  async verifyPasswordOtp(payload: VerifyForgetPasswordDto) {
    // const { email, code } = payload;
    const { code } = payload;

    const otp = await this.otpService.verifyOTP({
      code: code,
      type: OtpType.RESET_PASSWORD,
    });

    if (otp) {
      return 'success';
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, password } = payload;

    const user = await this.userService.getByEmail(email);

    const hashedPassword = await HashData(password);
    user.password = hashedPassword;

    await user.save();

    return `Password Change Successfully`;
  }
  async requestOtp(payload: RequestOtpDto) {
    const { email, type } = payload;

    const user = await this.userService.getByEmail(email);

    const otp = await this.otpService.sendOtp({
      email: user.email,
      type: type,
      userName: user.userName,
    });
    return otp;
  }
  async token(payload: any) {
    payload = {
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME,
      }),
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
        expiresIn: ENVIRONMENT.JWT.JWT_REFRESH_EXP_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(payload: AccessTokenDto) {
    const { accessToken } = payload;
    try {
      const decoded = await this.jwt.verifyAsync(accessToken, {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
      });

      const user = await this.userService.getById(decoded._id);

      if (!user || !user.refreshToken) {
        throw new BadRequestException('Invalid request');
      }

      const decodeRefreshToken = await this.jwt.verifyAsync(user.refreshToken, {
        secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
      });

      if (decodeRefreshToken._id !== decoded._id) {
        throw new ForbiddenException();
      }

      const token = await this.token(user);
      return token.accessToken;
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }
}
