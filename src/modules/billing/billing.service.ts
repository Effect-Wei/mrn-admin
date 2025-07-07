import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '@/modules/user/user.entity';
import { BillingIntervals, OneTimeBilling } from '@/modules/billing/billing.entity';
import { ERROR_MESSAGES } from '@/constants/error-messages'; // 引入错误信息常量

@Injectable()
export class BillingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(BillingIntervals) private billingRepo: Repository<BillingIntervals>,
    @InjectRepository(OneTimeBilling) private oneTimeBillingRepo: Repository<OneTimeBilling>,
  ) {}

  private async findUserById(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    return user;
  }

  async updateUserPoints(userId: number, amount: number): Promise<void> {
    const user = await this.findUserById(userId);
    if (user.points < amount) throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_POINTS);
    user.points -= amount;
    await this.userRepo.save(user);
  }

  async startInterval(userId: number, startTime: Date, rate: number = 1, startLocation?: string) {
    const result = await this.userRepo
      .createQueryBuilder('user')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)')
          .from(BillingIntervals, 'billingInterval')
          .where('billingInterval.userId = :userId', { userId })
          .andWhere('billingInterval.endTime IS NULL');
      }, 'existingIntervalCount')
      .where('user.id = :userId', { userId })
      .getRawOne();

    if (!result) throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);

    const { existingIntervalCount, user_points: points } = result;

    if (existingIntervalCount > 0)
      throw new BadRequestException(ERROR_MESSAGES.BILLING_ALREADY_IN_PROGRESS);

    if (points <= 0) throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_POINTS);

    const interval = this.billingRepo.create({ userId, startTime, rate, startLocation });
    return await this.billingRepo.save(interval);
  }

  async endInterval(id: number, endTime: Date, endLocation?: string) {
    const interval = await this.billingRepo.findOne({ where: { id } });
    if (!interval) throw new BadRequestException(ERROR_MESSAGES.BILLING_INTERVAL_NOT_FOUND);
    if (interval.endTime)
      throw new BadRequestException(ERROR_MESSAGES.BILLING_INTERVAL_ALREADY_ENDED);

    const duration = Math.ceil((endTime.getTime() - interval.startTime.getTime()) / 1000);
    const amount = Math.ceil(duration * interval.rate);

    interval.endTime = endTime;
    interval.amount = amount;
    interval.endLocation = endLocation;

    const user = await this.findUserById(interval.userId);
    user.points -= amount;

    await this.billingRepo.save(interval);
    await this.userRepo.save(user);

    return interval;
  }

  async recordOneTimeBilling(userId: number, timestamp: Date, amount: number, location?: string) {
    const user = await this.findUserById(userId);

    const roundedAmount = Math.ceil(amount);
    if (user.points < roundedAmount)
      throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_POINTS);

    const billing = this.oneTimeBillingRepo.create({
      userId,
      timestamp,
      amount: roundedAmount,
      location,
    });
    user.points -= roundedAmount;

    await this.oneTimeBillingRepo.save(billing);
    await this.userRepo.save(user);

    return billing;
  }

  async endCurrentIntervalByUserId(userId: number, endTime: Date, endLocation?: string) {
    const interval = await this.billingRepo.findOne({
      where: { userId, endTime: null },
    });
    if (!interval) throw new BadRequestException(ERROR_MESSAGES.BILLING_INTERVAL_NOT_FOUND);

    const duration = Math.ceil((endTime.getTime() - interval.startTime.getTime()) / 1000);
    const amount = duration * interval.rate;

    interval.endTime = endTime;
    interval.amount = amount;
    interval.endLocation = endLocation;

    const user = await this.findUserById(userId);
    user.points -= amount;

    await this.billingRepo.save(interval);
    await this.userRepo.save(user);

    return interval;
  }
}
