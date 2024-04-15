import { Module } from '@nestjs/common';
import { OutSourceService } from './outsource.service';
import { OutSourceController } from './outsource.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OutSource, OutSourceSchema } from './schema/outsource.schema';
import { MailModule } from 'src/node-mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutSource.name, schema: OutSourceSchema },
    ]),
    MailModule,
  ],
  controllers: [OutSourceController],
  providers: [OutSourceService],
})
export class OutSourceModule {}
