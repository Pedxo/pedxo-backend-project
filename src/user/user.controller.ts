import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { BecomeTalentDTO } from './dto/create.talent.dto';
import { Talent } from './schema/talent.schema';
import { HireTalentDTO } from './dto/hire.talent.dto';

@Controller('user')

export class UserController {
    constructor(
        private userService: UserService,
        ){}

   // @UseGuards(AuthGuard)
    @Get('findall')
    async findallUser(): Promise<User[]>{
        return await this.userService.findall()
    }

    @Get('/findAllTalent')
    async findAllTalent(): Promise<Talent[]>{
        return await this.userService.findAllTalent()
    }

    @Get('/')
    async homepage(){
        return 'this is home page...'
    }

    @UseGuards(AuthGuard)
    @Post('/become/talent')
    async becomeATalent(@CurrentUser() user: User, @Body() body: BecomeTalentDTO):Promise<any>{
    
        return await this.userService.becomeTalent(user, body)

    }


    //@UseGuards(AuthGuard)//i will use this to make only admin to only approve talent
    @Post('/talent/approve/:id')
    async ApprovedTalent(@Param('id') id: string){
        return await this.userService.approvedTalent(id)
    }

    @UseGuards(AuthGuard)
    @Post('/hire/talent')
    async hireTalent(@Body() hireInput: HireTalentDTO, @CurrentUser() user: User ){
        return await this.userService.hiredTalent(hireInput, user)
    }
    
    



}
