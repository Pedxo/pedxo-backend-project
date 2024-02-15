import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Talent, TalentSchema } from './schema/talent.schema';
import { HireTalent, HireTalentSchema } from './schema/hire.talent';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Talent.name, schema: TalentSchema }]),
    MongooseModule.forFeature([{name: HireTalent.name, schema: HireTalentSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
