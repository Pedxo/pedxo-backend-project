import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookDemo, BookDemoSchema } from '../schema/demo.schema';
import { BookDemoController } from '../controller/demo.controller';
import { BookDemoService } from '../service/demo.service';
import { MailModule } from 'src/node-mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookDemo.name, schema: BookDemoSchema },
    ]),
    MailModule,
  ],
  controllers: [BookDemoController],
  providers: [BookDemoService],
})
export class BookDemoModule {}
