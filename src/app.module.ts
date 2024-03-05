import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
   ConfigModule.forRoot({
    isGlobal: true
   }),
   MongooseModule.forRootAsync({
    useFactory: async (config: ConfigService)=>({
      uri: config.get<string>('MONGO_URI')
    }),
    inject: [ConfigService]
   }),
    UserModule, AuthModule, AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
