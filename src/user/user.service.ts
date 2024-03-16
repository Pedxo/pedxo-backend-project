import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create.user.dto';
import { HashData } from 'src/common/hashed/hashed.data';
import { Update } from './dto/update.user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async create(payload: CreateUserDTO) {
    const { password } = payload;

    const hashPassword = await HashData(password);

    await this.userModel.create({
      ...payload,
      password: hashPassword,
    });

    return `success`;
    // const jwtPayload = {
    //   _id: newUser._id,
    //   firstName: newUser.firstName,
    //   lastName: newUser.lastName,
    //   email: newUser.email,
    // };
    // const token = this.jwt.sign(jwtPayload);
    // return token;
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
}
