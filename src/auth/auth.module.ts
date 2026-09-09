import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { AuthService } from './services/auth.service';
import type { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { SessionService } from './services/session.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { UsersModule } from 'src/users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    SessionsModule,
    UsersModule,
    JwtModule.registerAsync({

      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({

        secret: config.getOrThrow('JWT_SECRET') as StringValue,

        signOptions: {
          expiresIn: config.getOrThrow<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [  AuthService,
  PasswordService,
  TokenService,
  SessionService,
  JwtStrategy,],

  exports: [JwtModule, AuthService,   PasswordService,
  TokenService,
  SessionService,],
})
export class AuthModule {}