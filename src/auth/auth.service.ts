import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { CreateUserDTO } from './dto/create.user.dto';
import { HashData, comparedHashed } from 'src/common/hashed/hashed.data';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.user.dto';


@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
    ){}

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

       const hashPassword=  await HashData(password);

        const newuser = await this.userModel.create({
            email,
            firstName,
            lastName,
            password: hashPassword,
            userName
        })

        const payload = {
            user: newuser._id
        }
        const token = await this.jwtService.signAsync( payload )
       return token
    }

    async loginUser(body: LoginUserDTO){
        const {email, password} = body
       try {
        const user = await this.userModel.findOne({email: email});
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND)
        }

        if (await comparedHashed(password, user.password) === false) {
            throw new HttpException('password do not matched', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const payload= {
            user: user._id
        }
        const token = await this.jwtService.signAsync(payload);
        return token
       } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        console.log(error)
        throw new InternalServerErrorException('server error')
       }
    }
}
