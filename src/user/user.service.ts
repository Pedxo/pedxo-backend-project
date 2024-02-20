import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Talent } from './schema/talent.schema';
import { BecomeTalentDTO } from './dto/create.talent.dto';
import { HireTalentDTO } from './dto/hire.talent.dto';
import { HireTalent } from './schema/hire.talent';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UpdateTalentProfileDTO } from './dto/update.talent.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Talent.name)
    private talentModel: Model<Talent>,

    @InjectModel(HireTalent.name)
    private hiredTalentModel: Model<HireTalent>
    ){}

    async findall(): Promise<User[]>{
        const user = await this.userModel.find().lean()

        return user
        
    }

    async becomeTalent( user: User, body: BecomeTalentDTO): Promise<any>{
        const {email, firstName, lastName, _id} = user

        const {workPhone, twitterLink, city, zipCode, skills, experienedLevel, image, workPattern} = body;
        const talent = await this.talentModel.findOne({$or: [{workEmail: email}, {workPhone: workPhone}]}).lean();

        if (talent) {
            if (talent.workEmail === email && talent.workPhone === workPhone) {
                throw new HttpException('work email and phone has already being used by another talent', HttpStatus.UNPROCESSABLE_ENTITY)
            }
            if (talent.workEmail === email) {
                throw new HttpException('work email has already be used by another talent', HttpStatus.UNPROCESSABLE_ENTITY)
            }
            if (talent.workPhone === workPhone) {
                throw new HttpException('can not use the phone number twice', HttpStatus.UNPROCESSABLE_ENTITY)
            }
        }

        await this.talentModel.create({
            firstName,
            lastName,
            workEmail: email,
            workPattern,
            workPhone,
            twitterLink,
            city,
            zipCode,
            skills,
            experienedLevel,
            image,
            userId: _id
        });



        return {
            Response: `your application have been received; kindly wait for approval`
        }

    }


    //the sort will be changed to most rated talent;
    //another one is to look at the ui and remove the name and email inputs on the talent form because it is not necessary
    async findAllTalent():Promise<Talent[]>{
        const talent = await this.talentModel.find({
            approved: true,
           //isTalentSuspended: false
        }).sort({createdAt: 'desc'}).lean();


         return talent
        
    }

    async findOneTalent(id: string): Promise<any>{
        const talent = await this.talentModel.findById(id).lean()
        if (!talent) {
           throw new HttpException('talent not found', HttpStatus.NOT_FOUND);
        }
        return talent
        // return `${talent.firstName} ${talent.lastName} ${talent.workEmail}`
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

    async suspendUser(id: string){
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new HttpException(`user with id ${id} does not exist`, HttpStatus.NOT_FOUND)
        }

        if (user.isTalent === true) {
            const userid = user._id.toString()
            
            await this.talentModel.findOneAndUpdate(
               {userId: userid},
               { $set: { isTalentSuspended: true } },
                {
                new: true,
                runValidators: true
                }
                 )
        }

        await this.userModel.findByIdAndUpdate(id,
            {isSuspended: true},
            {new: true, runValidators: true}
        );

        return  `user suspended successfully`;
    }

    async suspendTalent(id: string){
        const talent = await this.talentModel.findById(id);
        if (!talent) {
            throw new HttpException(`talent with id ${id} does not exist`, HttpStatus.NOT_FOUND)
        }

        await this.talentModel.findByIdAndUpdate(id,
            {isTalentSuspended: true},
            {new: true, runValidators: true}
        );

        return  `talent suspended successfully`;
    }


    async UnsuspendUser(id: string){

        const user = await this.userModel.findById(id);
        if (!user) {
            throw new HttpException(`user with id ${id} does not exist`, HttpStatus.NOT_FOUND)
        }

        if (user.isTalent === true) {
            const userid = user._id.toString()
            
            await this.talentModel.findOneAndUpdate(
               {userId: userid},
               { $set: { isTalentSuspended: false } },
                {
                new: true,
                runValidators: true
                }
                 )
        }

        await this.userModel.findByIdAndUpdate(id,
            {isSuspended: false},
            {new: true, runValidators: true}
        );

        return  `user not longer suspended`;

    }


    async UnsuspendTalent(id: string){
        const talent = await this.talentModel.findById(id);
        if (!talent) {
            throw new HttpException(`talent with id ${id} does not exist`, HttpStatus.NOT_FOUND)
        }

        await this.talentModel.findByIdAndUpdate(id,
            {isTalentSuspended: false},
            {new: true, runValidators: true}
        );

        return  `talent no longer suspended`;
    }


    async updateUpdateUserProfile(body: UpdateUserDTO, user: User){
   try {
    const id = user._id;
  const updatedProfile=  await this.userModel.findByIdAndUpdate(id, body, {new: true, runValidators: true}).lean();

    if (!updatedProfile) {
            throw new HttpException('your profile was not updated, try again', HttpStatus.CONFLICT)
        }
  return {
    Response: `you have successfully updated your profile with`, body
  };

   } catch (error) {
    if (error instanceof HttpException) {
        throw error
    }
    console.log(error)
    throw new InternalServerErrorException('server error')
   }

    }

    async updateUpdateTalentProfile(body: UpdateTalentProfileDTO, user: User){
      try {
        const id = user._id
        const dbUser = await this.userModel.findById(id);
 
        if (dbUser.isTalent === false) {
         return
        }
 
        const talent = await this.talentModel.findOne({
         userId: id
        })
 
        if (talent.isTalentSuspended === true) {
         throw new HttpException(`you can't update your profile for now. kindly contact support for help`, HttpStatus.UNAUTHORIZED)
        }
 
        const talentId = talent._id;
 
        const updatedTalent = await this.talentModel.findByIdAndUpdate(talentId, body, {new: true, runValidators: true})
 
        if (!updatedTalent) {
         throw new HttpException(`couldn't update your profile for now please try again`, HttpStatus.SERVICE_UNAVAILABLE)
        }
 
        return `updated successfully`
      } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }

        throw new InternalServerErrorException('server error')
      }
       
    }

   async hiredTalent(hiredInput: HireTalentDTO, user: User){
        const {_id} = user;

        const {talentId, workingPeriod} = hiredInput;

        const talent = await this.talentModel.findById(talentId);

        if (talent.isTalentSuspended === true) {
            throw new HttpException('can not hire this talent for now', HttpStatus.UNPROCESSABLE_ENTITY)
        }

       const hiredTalent = await this.hiredTalentModel.create({
            talentId,
            workingPeriod,
            userId: _id
        });

        return hiredTalent
    }
}
