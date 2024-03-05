import { Controller, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private adminServic: AdminService){}

       //@UseGuards(AuthGuard)//i will use this to make only admin to only approve talent
       @Post('/talent/approve/:id')
       async ApprovedTalent(@Param('id') id: string){
           return await this.adminServic.approvedTalent(id)
       }

         //protected and only admin can acess it
    @Post('/suspend/user/:id')
    async SuspendUser(@Param('id') id: string){
        return await this.adminServic.suspendUser(id)
    }

       //protected and only admin can acess it
       @Post('/suspend/talent/:id')
       async SuspendTalent(@Param('id') id: string){
           return await this.adminServic.suspendTalent(id)
       }

          //protected and only admin can acess it
    @Post('/unsuspend/user/:id')
    async UnsuspendUser(@Param('id') id: string){
        return await this.adminServic.UnsuspendUser(id)
    }

          //protected and only admin can acess it
          @Post('/unsuspend/talent/:id')
          async UnsuspendTalent(@Param('id') id: string){
              return await this.adminServic.UnsuspendTalent(id)
          }
   
}
