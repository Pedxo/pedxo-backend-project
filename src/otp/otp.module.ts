import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OtpSchema } from './schema/otp.schema';
import { MailModule } from 'src/node-mailer/mailer.module';
import { OtpService } from './service/otp.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OTP.name, schema: OtpSchema }]),
    MailModule,
  ],
  controllers: [],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
