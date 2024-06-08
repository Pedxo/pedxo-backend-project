import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
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
import {
  generateResetOTP,
  generateVerifyOTP,
} from 'src/common/constant/generate.string';
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
      throw new BadGatewayException(
        'Your code has either expire or is Invalid',
      );
    }
    return otp;
  }
  async sendOtp(payload: SentOtpDto) {
    const { email, type, userName } = payload;

    let code: any;

    let template: any;
    let subject: any;

    if (type === OtpType.EMAIL_VERIFICATION) {
      code = generateVerifyOTP();

      template = await welcomeMessage(userName, code);
      subject = `Account Verification`;
    }

    if (type === OtpType.RESET_PASSWORD) {
      code = generateResetOTP();

      template = await resetPasswordMessage(userName, code);
      subject = `Reset Password`;
    }

    const otp = await this.createOtp({ email, code, type });

    if (!otp) {
      throw new InternalServerErrorException('error occur while sending otp');
    }

    await this.mailService.sendMessage(email, subject, template);

    return true;
  }
}
