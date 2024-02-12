import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Talent } from './schema/talent.schema';
import { BecomeTalentDTO } from './dto/create.talent.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Talent.name)
    private talentModel: Model<Talent>
    ){}

    async findall(): Promise<User[]>{
        const user = await this.userModel.find().lean()

        return user
        
    }

    async becomeTalent( user: User, body: BecomeTalentDTO): Promise<any>{

        const {firstName, lastName, workEmail, workPhone, twitterLink, city, zipCode, skills, experienedLevel, image, workPattern} = body;
        const talent = await this.talentModel.findOne({$or: [{workEmail: workEmail}, {workPhone: workPhone}]}).lean();

        if (talent) {
            if (talent.workEmail === workEmail && talent.workPhone === workPhone) {
                throw new HttpException('work email and phone has already being used by another talent', HttpStatus.UNPROCESSABLE_ENTITY)
            }
            if (talent.workEmail === workEmail) {
                throw new HttpException('work email has already be used by another talent', HttpStatus.UNPROCESSABLE_ENTITY)
            }
            if (talent.workPhone === workPhone) {
                throw new HttpException('can not use the phone number twice', HttpStatus.UNPROCESSABLE_ENTITY)
            }
        }

        await this.talentModel.create({
            firstName,
            lastName,
            workEmail,
            workPattern,
            workPhone,
            twitterLink,
            city,
            zipCode,
            skills,
            experienedLevel,
            image,
            userId: user.user
        });



        return {
            Response: `your application have been received; kindly wait for approval`
        }

    }


    //the sort will be changed to most rated talent;
    //another one is to look at the ui and remove the name and email inputs on the talent form because it is not necessary
    async findAllTalent():Promise<Talent[]>{
        const talent = await this.talentModel.find({approved: true}).sort({createdAt: 'desc'}).populate('userId').lean();

            return talent
        
    }

    async approvedTalent(id: string): Promise<any>{
        const talent = await this.talentModel.findById(id).lean();

        if (!talent) {
            throw new HttpException(`talent with id ${id} doesn't exist`, HttpStatus.NOT_FOUND)
        }

        if (talent.approved === true) {
            throw new HttpException('user application is already approved', HttpStatus.UNPROCESSABLE_ENTITY)
        }

       const talentupdated = await this.talentModel.findByIdAndUpdate(id, {approved: true}, 
            {
            new: true,
            runValidators: true
            });


        const userid = talent.userId;

        if (talentupdated.approved = true) {
         await this.userModel.findByIdAndUpdate(
                userid, 
                {isTalent: true},

                {
                    new: true,
                    runValidators: true
                }
              
                )

        }
        
        return {
            Response: `talent ${talentupdated.firstName, talentupdated.lastName} application approved successfully`
        }

    }
}
