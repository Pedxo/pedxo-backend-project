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

        const {twitterLink, city, zipCode, skills, experienedLevel, image, workPattern, jobNature, yearOfExperienceInSales, studentType, nameOfSchoolOrBootCamp, graduationdate, } = body;
        const talent = await this.talentModel.findOne({workEmail: email}).lean();

        // const talent = await this.talentModel.findOne({$or: [{workEmail: email}, {workPhone: workPhone}]}).lean();

        if (talent) {
            if (talent.workEmail === email) {
                throw new HttpException('work email has already be used by another talent', HttpStatus.UNPROCESSABLE_ENTITY)
            } 
        }

        await this.talentModel.create({
            yearOfExperienceInSales,
            studentType,
            nameOfSchoolOrBootCamp,
            graduationdate,
            jobNature,
            firstName,
            lastName,
            workEmail: email,
            workPattern,
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
        const talent = await this.talentModel.find({ approved: true, isTalentSuspended: false}).sort({createdAt: 'desc'}).lean();
         return talent   
    }

    async findOneTalent(id: string): Promise<any>{
        const talent = await this.talentModel.findById(id).lean()
        if (!talent) {
           throw new HttpException('talent not found', HttpStatus.NOT_FOUND);
        }
        return talent
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
  try {
    const {_id} = user;
    if (!user || user.isSuspended === true) {
        throw new HttpException('you can proceed with request', HttpStatus.FORBIDDEN)
    }

    const {name, email, whereYouLive, state, country, YourTitle, haveYouBuildSomePart, workStartDate, wantTalentAs, paymentPattern, yourCurrentJob, minimumToPayToTalent, website, githubLink, linkedIn, twitterLink} = hiredInput;

   const hiredTalent = await this.hiredTalentModel.create({
        name,
        email,
        whereYouLive,
        state,
        country,
        YourTitle,
        haveYouBuildSomePart,
        workStartDate,
        wantTalentAs,
        paymentPattern,
        yourCurrentJob,
        minimumToPayToTalent,
        website,
        githubLink,
        linkedIn,
        twitterLink,
        userId: _id
    });

    return hiredTalent
  } catch (error) {
    if (error instanceof HttpException) {
        throw error
    }
    console.log(error)
    throw new InternalServerErrorException('server error')
  }
    }
}
