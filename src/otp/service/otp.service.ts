import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateOtpDTO,
  SentOtpDto,
  ValidateOtpDto,
  VerifyOTPDto,
} from '../dto/otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OtpDocument } from '../schema/otp.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/node-mailer/service/email.service';
import { OtpType } from '../enum/opt.type.enum';
import { generateOTPString } from 'src/common/constant/generate.string';
import { welcomeMessage } from 'src/common/constant/message/welcome.message';
import { resetPasswordMessage } from 'src/common/constant/message/reset-password.message';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP.name) private otpModel: Model<OtpDocument>,
    private mailService: EmailService,
  ) {}

  async createOtp(payload: CreateOtpDTO) {
    const { email, type } = payload;

    const otpExist = await this.otpModel.findOne({ email, type });

    if (!otpExist) {
      return await this.otpModel.create({ ...payload });
    }

    return await this.otpModel.findByIdAndUpdate(
      { _id: otpExist._id },
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }

  async verifyOTP(payload: VerifyOTPDto): Promise<Boolean> {
    const { code, type } = payload;
    const otpExist = await this.validateOtp({ code, type });

    await this.otpModel.findByIdAndDelete(otpExist._id);

    return true;
  }

  async validateOtp(payload: ValidateOtpDto) {
    const { code, type } = payload;
    const otp = await this.otpModel.findOne({ code, type });
    if (!otp) {
      throw new UnauthorizedException(
        'Your code has either expire or is Invalid',
      );
    }
    return otp;
  }
  async sendOtp(payload: SentOtpDto) {
    const { email, type, userName } = payload;

    const code = generateOTPString();

    let template;
    let subject;

    if (type === OtpType.EMAIL_VERIFICATION) {
      template = await welcomeMessage(userName, code);
      subject = `Action Request`;
    }

    if (type === OtpType.RESET_PASSWORD) {
      template = await resetPasswordMessage(userName, code);
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
