import { ForbiddenException, Injectable } from '@nestjs/common';
import { HireDTO } from './dto/hire.talent.dto';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Hire } from './schemas/hire.schema';
import { Model } from 'mongoose';

@Injectable()
export class HireService {
  constructor(@InjectModel(Hire.name) private hireModel: Model<Hire>) {}
  async talent(payload: HireDTO, user: User) {
    const { _id } = user;
    if (!user || user.isSuspended === true) {
      throw new ForbiddenException('you can proceed with request');
    }

    const hiredTalent = await this.hireModel.create({
      ...payload,
      userId: _id,
    });

    return hiredTalent;
  }
}
