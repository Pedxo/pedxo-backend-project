import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as svgCaptcha from 'svg-captcha';
import { Captcha, CaptchaDocument } from './captcha.schema';

@Injectable()
export class CaptchaService {
  private readonly TTL_MS = 5 * 60 * 1000; // 5 min

  constructor(
    @InjectModel(Captcha.name)
    private readonly captchaModel: Model<CaptchaDocument>,
  ) {}

  async generate() {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 3,
      color: true,
      ignoreChars: '0oO1ilI', // avoid ambiguous chars
    });

    const record = await this.captchaModel.create({
      answer: captcha.text.toLowerCase(),
      expiresAt: new Date(Date.now() + this.TTL_MS),
    });

    return {
      captchaId: record._id.toString(),
      image: captcha.data, // raw SVG markup
    };
  }

  async verify(captchaId: string, userInput: string): Promise<boolean> {
    if (!captchaId || !userInput) return false;

    const record = await this.captchaModel.findById(captchaId);
    if (!record) return false; // not found, already deleted, or bad id

    // single-use: delete immediately regardless of pass/fail
    await this.captchaModel.deleteOne({ _id: captchaId });

    const isExpired = record.expiresAt.getTime() < Date.now();
    if (isExpired || record.used) return false;

    return record.answer === userInput.trim().toLowerCase();
  }
}
