import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOtpDTO, SentOtpDto, VerifyOTPDto } from '../dto/otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OtpDocument } from '../schema/otp.schema';
import { Model } from 'mongoose';
import { token } from 'src/common/constant/generate.string';
import { EmailService } from 'src/node-mailer/service/email.service';
import { OtpType } from '../enum/opt.type.enum';
import { encode } from 'base-64';

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
  async sendOtp(payload: SentOtpDto) {
    const { email, type } = payload;
    //generate the code
    const code = token;

    let template;
    let subject;

    const encodedEmail = encode(email);
    const encodedCode = encode(code);

    if (type === OtpType.EMAIL_VERIFICATION) {
      template = `Kindly verify your action user this link to verify your account https://pedxo.netlify.app/login/?email=${encodedEmail}&code=${encodedCode}`;
      subject = `Action Request`;
    }

    if (type === OtpType.RESET_PASSWORD) {
      template = `Kindly verify your action using this link to reset your password https://pedxo.netlify.app/reset-password/update/?email=${encodedEmail}&code=${encodedCode}`;
      subject = `Action Request`;
    }

    const otp = await this.createOtp({ email, code });
    if (!otp) {
      throw new UnprocessableEntityException('error occur while sending otp');
    }

    await this.mailService.sendMessage(email, subject, template);

    return true;
  }
}
