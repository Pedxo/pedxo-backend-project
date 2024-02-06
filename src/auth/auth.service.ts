import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { CreateUserDTO } from './dto/create.user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async create(body: CreateUserDTO){
        
        const {email, firstName, lastName, userName, password } = body;

        const user = await this.userModel.findOne({
            $or: [
                {email: email}, {userName: userName}
            ]
        });

        if (user) {

            if (user.email ===email && user.userName === userName) {
                throw new HttpException('user with email and username already exist', HttpStatus.UNPROCESSABLE_ENTITY)
            }

            if (user.email===email) {
                throw new HttpException('user with same email address already exist', HttpStatus.UNPROCESSABLE_ENTITY)
            }
            if (user.userName === userName) {
                throw new HttpException('user with same username already exist', HttpStatus.UNPROCESSABLE_ENTITY)
            }


        }

        const newuser = await this.userModel.create({
            email,
            firstName,
            lastName,
            password,
            userName
        })

       return newuser
    }
}
