import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
