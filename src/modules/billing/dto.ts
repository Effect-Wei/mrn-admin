import { IsInt, IsOptional, IsString, IsNumber, Min, IsPositive } from 'class-validator';

export class StartIntervalDto {
  @IsInt()
  userId: number;

  @IsNumber()
  timestamp: number; // 修改为数字类型

  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  startLocation?: string;
}

export class EndIntervalDto {
  @IsInt()
  id: number;

  @IsNumber()
  timestamp: number; // 修改为数字类型

  @IsOptional()
  @IsString()
  endLocation?: string;
}

export class RecordOneTimeBillingDto {
  @IsInt()
  userId: number;

  @IsNumber()
  timestamp: number; // 修改为数字类型

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  location?: string;
}

export class EndCurrentIntervalByUserIdDto {
  @IsInt()
  userId: number;

  @IsNumber()
  timestamp: number; // 修改为数字类型

  @IsOptional()
  @IsString()
  endLocation?: string;
}
