import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.authService.create(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Get('verify-email')
  async verifyEmail(@Query() payload: VerifyEmailDto) {
    return await this.authService.verifyEmail(payload);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    return await this.authService.forgotPassword(payload);
  }

  @Get('verify-reset-password-otp')
  async verifyPasswordOtp(@Query() payload: VerifyForgetPasswordDto) {
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
}
