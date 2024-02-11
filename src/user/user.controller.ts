import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { Talent } from './schema/talent.schema';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { BecomeTalentDTO } from './dto/create.talent.dto';

@Controller('user')

export class UserController {
    constructor(private userService: UserService){}

   // @UseGuards(AuthGuard)
    @Get('findall')
    async findallUser(): Promise<User[]>{
        return await this.userService.findall()
    }

    @Get('/')
    async homepage(){
        return 'this is home page...'
    }

    @UseGuards(AuthGuard)
    @Post('/talenet')
    async becomeATalent(@Body() body: BecomeTalentDTO, @CurrentUser() user: User,):Promise<any>{
        return await this.userService.becomeTalent(body, user)

    }

    //@UseGuards(AuthGuard)//i will use this to make only admin to only approve talent
    @Post('/talent/approve/:id')
    async ApprovedTalent(@Param('id') id: string){
        return await this.userService.approvedTalent(id)
    }

}
