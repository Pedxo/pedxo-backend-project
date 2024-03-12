import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { TalentModule } from 'src/talent/talent.module';

@Module({
  imports: [UserModule, TalentModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
