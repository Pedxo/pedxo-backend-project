import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Captcha, CaptchaSchema } from './captcha.schema';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Captcha.name, schema: CaptchaSchema }]),
  ],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService], // so your signup module can use it
})
export class CaptchaModule {}
