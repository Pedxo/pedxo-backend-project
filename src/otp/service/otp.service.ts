import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOtpDTO, VerifyOTPDto } from '../dto/otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OtpDocument } from '../schema/otp.schema';
import { Model } from 'mongoose';
import { token } from 'src/common/constant/generate.string';
import { EmailService } from 'src/node-mailer/service/email.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP.name) private otpModel: Model<OtpDocument>,
    private mailService: EmailService,
  ) {}

  async createOtp(payload: CreateOtpDTO) {
    const { email } = payload;
    const otp = await this.otpModel.findOneAndUpdate(
      { email: email },
      { ...payload },
      { new: true, upsert: true },
    );
    return otp;
  }

  async verifyOTP(payload: VerifyOTPDto): Promise<Boolean> {
    const { code, email } = payload;
    const otpExist = await this.validateOtp(email, code);

    await this.otpModel.findByIdAndDelete(otpExist._id);

    return true;
  }

  async validateOtp(email: string, code: string) {
    const otp = await this.otpModel.findOne({ email, code });
    if (!otp) {
      throw new UnauthorizedException(
        'Your code has either expire or is Invalid',
      );
    }
    return otp;
  }
  async sendOtp(email: string) {
    //generate the code
    const code = token;

    const template = `Kindly verify your action user this link https://pedxo.com/?${code}`;
    const subject = `Action Request`;

    //create otp
    const otp = await this.createOtp({ email, code });
    if (!otp) {
      throw new UnprocessableEntityException('error occur while sending otp');
    }

    //await this.mailService.sendMessage(email, subject, template);

    return true;
  }
}
