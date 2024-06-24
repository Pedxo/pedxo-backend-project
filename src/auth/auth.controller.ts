import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { LoginUserDTO } from '../user/dto/login.user.dto';
import {
  ForgetPasswordDto,
  RequestOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto/auth.dto';
import { Serialize } from 'src/common/interceptor/custom.interceptor';
import { LoginResponse, UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { User } from 'src/user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.authService.create(body);
  }

  // @Serialize(UserDto)
  @Serialize(LoginResponse)
  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Post('verify-email')
  async verifyEmail(@Body() payload: VerifyEmailDto) {
    return await this.authService.verifyEmail(payload);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    return await this.authService.forgotPassword(payload);
  }

  @Post('verify-reset-password-otp')
  async verifyPasswordOtp(@Body() payload: VerifyForgetPasswordDto) {
    return await this.authService.verifyPasswordOtp(payload);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  @Post('request-otp')
  async requestOtp(@Body() payload: RequestOtpDto) {
    return await this.authService.requestOtp(payload);
  }

  @UseGuards(AuthGuard)
  @Get('refresh-token/:token')
  async refreshToken(
    @Param('token') accessToken: string,
    @CurrentUser() user: User,
  ) {
    return await this.authService.refreshToken(accessToken, user);
  }
}
