import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OutSource, OutSourceDocument } from './schema/outsource.schema';
import { Model } from 'mongoose';
import { OutSourceDto } from './dto/outsource.dto';
import { EmailService } from 'src/node-mailer/service/email.service';
import { ResponseMessage } from 'src/common/constant/message/message.constant';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

@Injectable()
export class OutSourceService {
  constructor(
    @InjectModel(OutSource.name)
    private outSourceModel: Model<OutSourceDocument>,
    private emailService: EmailService,
  ) {}
  async create(payload: OutSourceDto) {
    const { full_Name } = payload;
    const outsource = await this.outSourceModel.create({ ...payload });

    if (!outsource) {
      throw new InternalServerErrorException(`Server error, try again`);
    }

    const ownerEmail = ENVIRONMENT.OWNER.OWNER_EMAIL;

    await this.emailService.sendMessage(
      outsource.email,
      ResponseMessage.subject,
      ResponseMessage.ResponseSender,
    );

    await this.emailService.sendMessage(
      ownerEmail,
      ResponseMessage.subject,
      ResponseMessage.toOwnerTemplate(full_Name),
    );

    return 'out source success';
  }
}
