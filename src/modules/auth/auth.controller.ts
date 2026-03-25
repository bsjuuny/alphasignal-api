import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifySync } from 'otplib';

@Controller('auth')
export class AuthController {
  constructor(private config: ConfigService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { username?: string; password?: string; totp?: string }) {
    const validUsername = this.config.get<string>('ARCHIVE_USERNAME');
    const validPassword = this.config.get<string>('ARCHIVE_PASSWORD');
    const totpSecret = this.config.get<string>('TOTP_SECRET');

    if (!validUsername || !validPassword || !totpSecret) {
      throw new InternalServerErrorException('서버 설정 오류');
    }

    if (body.username !== validUsername || body.password !== validPassword) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    if (!body.totp) {
      return { step: 'totp' };
    }

    const result = verifySync({ token: body.totp, secret: totpSecret });
    if (!result?.valid) {
      throw new UnauthorizedException('인증 코드가 올바르지 않습니다.');
    }

    return { ok: true };
  }
}
