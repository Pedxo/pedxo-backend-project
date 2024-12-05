import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { Model } from 'mongoose';
import { CreateCreateDto } from './dto/contract.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,
  ) {}
  async createContract(payload: CreateCreateDto) {
    const contract = await this.contractModel.create({
      ...payload,
    });
    if (!contract) {
      throw new BadRequestException('Error occur while creating contract');
    }
    return contract;
  }
}
