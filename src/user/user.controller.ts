import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { Update } from './dto/update.user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  async dashboard(@CurrentUser() user: User) {
    return user;
  }

  @Get('findOne/:id')
  async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async update(@Body() payload: Update, @CurrentUser() user: User) {
    return await this.userService.update(payload, user);
  }

  @Get('delete/:username')
  async deleteUser(@Param('username') username: string) {
    return await this.userService.deleteUser(username);
  }
}
