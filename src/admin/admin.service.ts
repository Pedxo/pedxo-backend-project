import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TalentService } from 'src/talent/talent.service';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private talentService: TalentService,
  ) {}

  async approvedTalent(id: string): Promise<any> {
    const talent = await this.talentService.getById(id);
    if (talent.approved === true) {
      throw new UnprocessableEntityException('talent is already approved');
    }

    return await this.talentService.approvedTalent(talent);
  }

  async suspendUser(id: string) {
    await this.userService.getById(id);
    const userSuspended = await this.userService.suspendUser(id);
    if (userSuspended.isTalent === true) {
      const userId = userSuspended._id;
      await this.suspendTalent(userId);
    }
  }

  async suspendTalent(id: string) {
    const talent = await this.talentService.getById(id);
    return await this.talentService.suspendTalent(id);
  }

  async unSuspendUser(id: string) {
    await this.userService.getById(id);
    const unSuspendedUser = await this.userService.unSuspendUser(id);
    if (unSuspendedUser.isTalent === true) {
      const userId = unSuspendedUser._id;
      await this.unSuspendTalent(userId);
    }
  }

  async unSuspendTalent(id: string) {
    const talent = await this.talentService.getById(id);
    return await this.talentService.unSuspendTalent(id);
  }
}
