import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HireService } from './hire.service';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { HireDTO } from './dto/hire.talent.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('hire')
export class HireController {
  constructor(private hireService: HireService) {}

  @UseGuards(AuthGuard)
  @Post()
  async talent(@Body() hireInput: HireDTO, @CurrentUser() user: User) {
    return await this.hireService.talent(hireInput, user);
  }
}
