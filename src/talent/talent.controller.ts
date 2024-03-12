import {
  Body,
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Patch,
} from '@nestjs/common';
import { TalentService } from './talent.service';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { Talent } from './schemas/talent.schema';
import { CreateTalentDto, UpdateDto } from './dto/talent.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('talent')
export class TalentController {
  constructor(private talentService: TalentService) {}

  @Get()
  async getAll(): Promise<Talent[]> {
    return await this.talentService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return await this.talentService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async become(
    @CurrentUser() user: User,
    @Body() payload: CreateTalentDto,
  ): Promise<any> {
    return await this.talentService.become(user, payload);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Body() payload: UpdateDto, @CurrentUser() user: User) {
    return await this.talentService.update(user, payload);
  }
}
