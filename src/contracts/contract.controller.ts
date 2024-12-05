import { Body, Controller, Post } from '@nestjs/common';
import { CreateCreateDto } from './dto/contract.dto';
import { ContractService } from './contract.service';

@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}
  @Post()
  async create(@Body() payload: CreateCreateDto) {
    return await this.contractService.createContract(payload);
  }
}
