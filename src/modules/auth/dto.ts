import { IsNotEmpty, IsString, IsInt, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class RegisterUserDto {
  @IsString()
  @Length(6, 20, {
    message: `用户名长度必须是$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  username: string;

  @IsString()
  @Length(6, 20, { message: `密码长度必须是$constraint1到$constraint2之间` })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}

export class GenerateQRCodeDto {
  @IsString()
  @IsNotEmpty({ message: '二维码类型不能为空' })
  type: string; // QR 码的类型，例如登录、支付等

  @IsInt()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: number; // 用户的唯一标识符
}

export class ResolveQRCodeDto {
  @IsString()
  @IsNotEmpty({ message: '数据不能为空' })
  data: string; // 转换成Base64字符串的数据
}
