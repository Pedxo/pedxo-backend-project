import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOtpDTO, SentOtpDto, VerifyOTPDto } from '../dto/otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OtpDocument } from '../schema/otp.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/node-mailer/service/email.service';
import { OtpType } from '../enum/opt.type.enum';
import { token } from 'src/common/constant/generate.string';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP.name) private otpModel: Model<OtpDocument>,
    private mailService: EmailService,
  ) {}

  async createOtp(payload: CreateOtpDTO) {
    const { email } = payload;

    const otpExist = await this.otpModel.findOne({ email });

    if (otpExist) {
      return await this.otpModel.findOneAndUpdate({ email }, payload, {
        new: true,
        upsert: true,
        runValidators: true,
      });
    }
    return await this.otpModel.create({ ...payload });
  }

  async verifyOTP(payload: VerifyOTPDto): Promise<Boolean> {
    const { code } = payload;
    const otpExist = await this.validateOtp(code);

    await this.otpModel.findByIdAndDelete(otpExist._id);

    return true;
  }

  async validateOtp(code: string) {
    const otp = await this.otpModel.findOne({ code });
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

    if (type === OtpType.EMAIL_VERIFICATION) {
      template = `Kindly verify your action user this link to activate your account https://pedxo.netlify.app/verifying-user-email/?code=${code}`;
      subject = `Action Request`;
    }

    if (type === OtpType.RESET_PASSWORD) {
      template = `Kindly verify your action using this link to reset your password https://pedxo.netlify.app/verify-request-reset-pwd/ver-doc/?code=${code}`;
      subject = `Action Request`;
    }

    const otp = await this.createOtp({ email, code, type });

    if (!otp) {
      throw new InternalServerErrorException('error occur while sending otp');
    }
    await this.mailService.sendMessage(email, subject, template);

    return true;
  }
}
