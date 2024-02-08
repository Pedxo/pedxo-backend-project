import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name)
    private userModel: Model<User>
    ){}

    async findall(): Promise<User[]>{
        const user = await this.userModel.find().lean().exec()

        return user
        
    }
}
