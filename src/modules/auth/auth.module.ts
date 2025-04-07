/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:25:41
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { QRcodeController } from './qrcode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRCode } from './qrcode.entity';
import { QRCodeService } from './qrcode.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
        };
      },
    }),
    TypeOrmModule.forFeature([QRCode]),
  ],
  controllers: [AuthController, QRcodeController],
  providers: [AuthService, LocalStrategy, JwtStrategy, QRCodeService],
})
export class AuthModule {}
