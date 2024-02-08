import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';

@Controller('user')

export class UserController {
    constructor(private userService: UserService){}

    @UseGuards(AuthGuard)
    @Get('findall')
    async findallUser(): Promise<User[]>{
        return await this.userService.findall()
    }

}
