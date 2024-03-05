import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Talent, TalentSchema } from 'src/user/schema/talent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Talent.name, schema: TalentSchema}])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
