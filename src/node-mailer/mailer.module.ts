import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './service/email.service';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: ENVIRONMENT.GOOGLE.SMTP_USER,
          pass: ENVIRONMENT.GOOGLE.AUTH_PASS,
        },
      },

      defaults: {
        from: '"Pedxo Support" <support@pedxo>',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}
