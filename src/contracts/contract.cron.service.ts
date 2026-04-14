import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { UserService } from 'src/user/user.service';

interface PedxoUserResponse {
  items: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    accounts: {
      id: number;
      user_id: number;
      account_number: string;
      account_name: string;
      balance: string;
      currency: string;
      type: string;
    }[];
  }[];
  total: number;
}

@Injectable()
export class ContractCronService {
  private readonly logger = new Logger(ContractCronService.name);

  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    private readonly userService: UserService,
  ) {}

  // ⏰ Runs every day at midnight
  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Running contract payment cron...');

    const now = new Date();
    // const pedxoPayUrl = process.env.PEDXO_PAY_URL;

    const contracts = await this.contractModel.find({
      status: 'assigned',
      //   isCompleted: false,
      isPaymentActive: true,
    });

    for (const contract of contracts) {
      try {
        await this.processContract(contract, now);
      } catch (error) {
        this.logger.error(
          `Error processing contract ${contract._id}: ${error.message}`,
        );
      }
    }
  }

  async processContract(contract: ContractDocument, now: Date) {
    // ❌ skip if no talent
    if (!contract.talentAssignedId?.length) return;

    // ❌ skip if contract ended
    if (contract.endDate && now > contract.endDate) return;

    // ❌ skip if not yet time
    if (!contract.nextPaymentDate || now < contract.nextPaymentDate) return;

    // 🔁 handle missed payments (catch-up loop)
    while (
      contract.nextPaymentDate &&
      now >= contract.nextPaymentDate &&
      (!contract.endDate || now <= contract.endDate)
    ) {
      this.logger.log(`Processing payment for contract`);

      // 🔁 pay all assigned talents
      for (const talentId of contract.talentAssignedId) {
        await this.payTalent(contract, talentId);
      }

      // ✅ update next cycle
      const contractId = (contract as any)._id;
      await this.contractModel.findByIdAndUpdate(contractId, {
        lastPaymentDate: contract.nextPaymentDate,
        nextPaymentDate: this.calculateNextPaymentDate(
          contract.nextPaymentDate,
          contract.paymentFrequency,
        ),
      });
    }
  }

  async payTalent(contract: ContractDocument, talentId: string) {
    try {
      const pedxoPayUrl = process.env.PEDXO_PAY_URL;

      const user = await this.userService.findUserById(contract.userId);
      const userEmail = user.email;
      // 🔍 check balance first
      const userResponse = await axios.get<PedxoUserResponse>(
        `${pedxoPayUrl}/account/users/${userEmail}`,
      );
      const accounts = userResponse.data.items[0]?.accounts || [];
      if (!accounts.length) {
        this.logger.warn(`No account found for user ${userEmail}`);
        return;
      }

      const userAccount = accounts[0];
      if (parseFloat(userAccount.balance) < contract.paymentRate) {
        this.logger.warn(`Insufficient funds for user ${userEmail}`);
        return;
      }

      // 💸 trigger payout
      await axios.post(`${pedxoPayUrl}/transaction/payout`, {
        type: 'payout',
        amount: contract.paymentRate,
        account_number: userAccount.account_number,
        ini_reference: `AUTO-${Date.now()}`,
      });

      this.logger.log(`Paid talent ${talentId} for contract `);
    } catch (error) {
      this.logger.error(
        `Payment failed for talent ${talentId}: ${error.message}`,
      );
    }
  }

  calculateNextPaymentDate(date: Date, frequency: string): Date {
    const next = new Date(date);

    switch (frequency) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(next.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        throw new Error('Invalid payment frequency');
    }

    return next;
  }

  // ⚠️ Replace this with real DB/service call
  //   async getTalentAccount(talentId: string): Promise<string> {
  //     // fetch from your talent service / DB
  //     return '9000000001'; // dummy
  //   }
}
