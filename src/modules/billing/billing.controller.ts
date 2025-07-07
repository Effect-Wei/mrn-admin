import { Controller, Post, Body } from '@nestjs/common';
import { BillingService } from './billing.service';
import { convertToDate } from '@/utils/date.util';
import {
  StartIntervalDto,
  EndIntervalDto,
  RecordOneTimeBillingDto,
  EndCurrentIntervalByUserIdDto,
} from './dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('interval/start')
  startInterval(@Body() body: StartIntervalDto) {
    const { userId, timestamp, rate, startLocation } = body;
    return this.billingService.startInterval(userId, convertToDate(timestamp), rate, startLocation);
  }

  @Post('interval/end')
  endInterval(@Body() body: EndIntervalDto) {
    const { id, timestamp, endLocation } = body;
    return this.billingService.endInterval(id, convertToDate(timestamp), endLocation);
  }

  @Post('once')
  recordOneTimeBilling(@Body() body: RecordOneTimeBillingDto) {
    const { userId, timestamp, amount, location } = body;
    return this.billingService.recordOneTimeBilling(
      userId,
      convertToDate(timestamp),
      amount,
      location,
    );
  }

  @Post('interval/end-by-user')
  endCurrentIntervalByUserId(@Body() body: EndCurrentIntervalByUserIdDto) {
    const { userId, timestamp, endLocation } = body;
    return this.billingService.endCurrentIntervalByUserId(
      userId,
      convertToDate(timestamp),
      endLocation,
    );
  }
}
