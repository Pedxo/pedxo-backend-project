import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { LoginUserDTO } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    //middleware?
    @Post('/user/create')
    async createuser(@Body() body: CreateUserDTO){
        return await this.authService.create(body)
    }

    //middleware?
    @Post('/user/login')
    async loginUser(@Body() body: LoginUserDTO){
        return await this.authService.loginUser(body)
    }

}



