import { Body, Controller, Post } from '@nestjs/common';
import { BookDemoService } from '../service/demo.service';
import { BookDemoDto } from '../dto/demo.dto';

@Controller('demo')
export class BookDemoController {
  constructor(private demoService: BookDemoService) {}
  @Post()
  async book(@Body() payload: BookDemoDto) {
    return await this.demoService.bookdemo(payload);
  }
}
