import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TalentModule } from './talent/talent.module';
import { HireModule } from './hire/hire.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './node-mailer/mailer.module';
import { OtpModule } from './otp/otp.module';
import { OutSourceModule } from './outsource/outsource.module';
import { BookDemoModule } from './bookdemo/module/demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TalentModule,
    HireModule,
    AdminModule,
    MailModule,
    OtpModule,
    OutSourceModule,
    BookDemoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
