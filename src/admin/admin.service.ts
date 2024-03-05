import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Talent } from 'src/user/schema/talent.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    
        @InjectModel(Talent.name)
        private talentModel: Model<Talent>
        ){}

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

}
