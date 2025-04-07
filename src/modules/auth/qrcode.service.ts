import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRCode } from './qrcode.entity';

@Injectable()
export class QRCodeService {
  constructor(
    @InjectRepository(QRCode)
    private readonly qrCodeRepository: Repository<QRCode>,
  ) {}

  // 创建二维码并存储到数据库
  async createQRCode(creatorId: number): Promise<QRCode> {
    const qrCode = this.qrCodeRepository.create({
      creatorId,
      isValid: true,
      createdAt: new Date(),
    });
    return await this.qrCodeRepository.save(qrCode);
  }

  // 验证二维码是否有效
  async validateQRCode(id: number, creatorId: number): Promise<boolean> {
    const qrCode = await this.qrCodeRepository.findOne({
      where: { id, creatorId, isValid: true },
    });
    return !!qrCode;
  }

  // 设置二维码无效
  async invalidateQRCode(id: number): Promise<void> {
    await this.qrCodeRepository.update(id, { isValid: false });
  }
}
