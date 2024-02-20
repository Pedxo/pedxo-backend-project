import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { BecomeTalentDTO } from './dto/create.talent.dto';
import { Talent } from './schema/talent.schema';
import { HireTalentDTO } from './dto/hire.talent.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UpdateTalentProfileDTO } from './dto/update.talent.dto';

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

    @Get('/findOneTalent/:id')
    async findOneTalent(@Param('id') id: string): Promise<any>{
        return await this.userService.findOneTalent(id)
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

    @UseGuards(AuthGuard)
    @Put('/update/profile')
    async updateUserProfile(@Body() updateBody: UpdateUserDTO, @CurrentUser() user: User){
        return await this.userService.updateUpdateUserProfile(updateBody, user)
    }
    

    @UseGuards(AuthGuard)
    @Put('/update/talent/profile')
    async updateTalentProfile(@Body() updateBody: UpdateTalentProfileDTO, @CurrentUser() user: User){
        return await this.userService.updateUpdateTalentProfile(updateBody, user)
    }

    //protected and only admin can acess it
    @Post('/suspend/user/:id')
    async SuspendUser(@Param('id') id: string){
        return await this.userService.suspendUser(id)
    }

    //protected and only admin can acess it
    @Post('/suspend/talent/:id')
    async SuspendTalent(@Param('id') id: string){
        return await this.userService.suspendTalent(id)
    }

    //protected and only admin can acess it
    @Post('/unsuspend/user/:id')
    async UnsuspendUser(@Param('id') id: string){
        return await this.userService.UnsuspendUser(id)
    }

       //protected and only admin can acess it
    @Post('/unsuspend/talent/:id')
       async UnsuspendTalent(@Param('id') id: string){
           return await this.userService.UnsuspendTalent(id)
       }


}
