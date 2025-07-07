import { Controller, Post, Req, Body, BadRequestException } from '@nestjs/common';
import { GenerateQRCodeDto, ResolveQRCodeDto } from './dto';
import { QRCodeService } from './qrcode.service';
import * as crypto from 'crypto';

@Controller('auth/qrcode')
export class QRcodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Post('generate')
  async generateQRcode(@Req() req: any, @Body() body: GenerateQRCodeDto) {
    // Step 1: 从请求中获取用户 ID

    // Step 2: 创建二维码记录（数据库生成自增 ID）
    const qrCode = await this.qrCodeService.createQRCode(body.userId);

    // Step 3: 构造需要加密的内容
    const content = {
      type: body.type, // QR 码的类型
      id: qrCode.id, // 数据库生成的二维码 ID
      userId: body.userId, // 用户的唯一标识
    };

    // Step 4: 检查并生成加密密钥
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('Environment variable SECRET_KEY is not set.');
    }
    const key = crypto.createHash('sha256').update(secretKey).digest();

    // Step 5: 加密数据并生成随机 IV 和认证标签
    const { encrypted, iv, authTag } = this.encryptData(content, key);

    // Step 6: 将加密后的数据、IV 和认证标签封装为结构体并转换为 Base64 字符串
    const payload = JSON.stringify({ encrypted, iv, authTag });
    const base64Payload = Buffer.from(payload, 'utf8').toString('base64');

    // Step 7: 返回 Base64 编码的结构体
    return base64Payload;
  }

  @Post('resolve')
  async resolveQRcode(@Req() req: any, @Body() body: ResolveQRCodeDto) {
    const { data } = body;

    // Step 1: 解码 Base64 字符串并解析为结构体
    const decodedPayload = Buffer.from(data, 'base64').toString('utf8');
    const { encrypted, iv, authTag } = JSON.parse(decodedPayload);

    // Step 2: 检查并生成解密密钥
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('Environment variable SECRET_KEY is not set.');
    }
    const key = crypto.createHash('sha256').update(secretKey).digest();

    let content;
    try {
      // Step 3: 解密数据并验证完整性
      content = this.decryptData(encrypted, iv, authTag, key);
    } catch (error) {
      throw new BadRequestException('Decryption failed or data integrity check failed.');
    }

    // Step 4: 验证二维码是否有效
    const { id, userId } = content;
    const qrCodeValid = await this.qrCodeService.validateQRCode(id, userId);
    if (!qrCodeValid) {
      throw new BadRequestException('Invalid QR code or user.');
    }

    // Step 5: 返回解密后的内容
    return { content };
  }

  // 使用 AES-256-GCM 加密数据
  private encryptData(data: any, key: Buffer): { encrypted: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag().toString('base64');
    return { encrypted, iv: iv.toString('base64'), authTag };
  }

  // 使用 AES-256-GCM 解密数据
  private decryptData(encrypted: string, iv: string, authTag: string, key: Buffer): any {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}
