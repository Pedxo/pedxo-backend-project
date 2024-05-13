import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BookDemoDto } from '../dto/demo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BookDemo, BookDemoDocument } from '../schema/demo.schema';
import { Model } from 'mongoose';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { EmailService } from 'src/node-mailer/service/email.service';
import { ResponseMessage } from 'src/common/constant/message/message.constant';

@Injectable()
export class BookDemoService {
  constructor(
    @InjectModel(BookDemo.name) private demoModel: Model<BookDemoDocument>,
    private emailService: EmailService,
  ) {}

  async bookdemo(payload: BookDemoDto) {
    const { full_Name, pick_date, company_name } = payload;
    const demo = await this.demoModel.create({ ...payload });
    if (!demo) {
      throw new InternalServerErrorException('Error Server');
    }

    const ownerEmail = ENVIRONMENT.OWNER.OWNER_EMAIL;

    const demoBooker = await this.emailService.sendMessage(
      demo.email,
      ResponseMessage.demoSubject,
      await ResponseMessage.responseToBooker(pick_date),
    );

    if (demoBooker) {
      await this.emailService.sendMessage(
        ownerEmail,
        ResponseMessage.demoSubject,
        ResponseMessage.toOwnerDemoTemplate(full_Name, pick_date, company_name),
      );
    }

    return `Demo Booked Successfully`;
  }
}
