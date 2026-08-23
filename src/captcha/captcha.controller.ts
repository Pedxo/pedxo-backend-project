import { Controller, Get } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('generate')
  async generateCaptcha() {
    return this.captchaService.generate();
    // returns { captchaId, image } — image is raw SVG string
  }
}
