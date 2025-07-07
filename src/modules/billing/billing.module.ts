import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingIntervals, OneTimeBilling } from './billing.entity';
import { User } from '@/modules/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillingIntervals, OneTimeBilling, User])],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
