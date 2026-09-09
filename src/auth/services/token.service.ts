import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow(
        'JWT_REFRESH_SECRET',
      ),
      expiresIn: this.configService.getOrThrow(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    });
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken =
      await this.generateAccessToken(payload);

    const refreshToken =
      await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(
      token,
    );
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(
      token,
      {
        secret: this.configService.getOrThrow(
          'JWT_REFRESH_SECRET',
        ),
      },
    );
  }

  decode(token: string) {
    return this.jwtService.decode(token) as JwtPayload;
  }
}