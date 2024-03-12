import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { LoginUserDTO } from '../user/dto/login.user.dto';

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
}
