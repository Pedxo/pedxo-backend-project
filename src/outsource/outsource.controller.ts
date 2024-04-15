import { Body, Controller, Post } from '@nestjs/common';
import { OutSourceService } from './outsource.service';
import { OutSourceDto } from './dto/outsource.dto';

@Controller('outsource')
export class OutSourceController {
  constructor(private outSourceService: OutSourceService) {}
  @Post()
  async create(@Body() payload: OutSourceDto) {
    return await this.outSourceService.create(payload);
  }
}
