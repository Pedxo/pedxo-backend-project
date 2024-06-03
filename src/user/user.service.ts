import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create.user.dto';
import { HashData } from 'src/common/hashed/hashed.data';
import { Update } from './dto/update.user.dto';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpType } from 'src/otp/enum/opt.type.enum';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private otpService: OtpService,
    private jwt: JwtService,
  ) {}

  async create(payload: CreateUserDTO) {
    const { password } = payload;

    const hashPassword = await HashData(password);

    const result = await this.userModel.create({
      ...payload,
      password: hashPassword,
    });

    const refreshToken = await this.token(result);

    result.refreshToken = refreshToken.refreshToken;

    await result.save();

    await this.otpService.sendOtp({
      email: result.email,
      type: OtpType.EMAIL_VERIFICATION,
      userName: result.userName,
    });

    delete result['_doc'].password;
    return 'success';
  }

  async getAll(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }

  async getByEmailOrUserName(email?: string, userName?: string): Promise<User> {
    const user = await this.userModel
      .findOne({ $or: [{ email }, { userName }] })
      .lean();
    return user;
  }

  async update(payload: Update, user: User) {
    const id = user._id.toString();
    await this.userModel.findByIdAndUpdate(
      id,
      { ...payload },
      {
        new: true,
      },
    );
    return {
      Response: `you have successfully updated your profile with`,
    };
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return user;
  }

  async approvedUserAsTalent(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { isTalent: true },
      { new: true },
    );
  }

  async suspendUser(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { isSuspended: true },
      { new: true },
    );
  }

  async unSuspendUser(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { isSuspended: false },
      { new: true },
    );
  }
  async deleteUser(payload: string) {
    const user = await this.userModel.findOneAndDelete(
      { userName: payload },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException(
        `user with username ${payload} doesn't exist`,
      );
    }
    return 'deleted';
  }

  async token(payload: any) {
    payload = {
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME,
      }),
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
        expiresIn: ENVIRONMENT.JWT.JWT_REFRESH_EXP_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
