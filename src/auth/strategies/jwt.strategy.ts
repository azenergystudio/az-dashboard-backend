import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

async validate(payload: JwtPayload) {
    const session =
        await this.sessionsService.findSession(
            payload.sessionId,
        );
    if (!session)
        throw new UnauthorizedException();

    if (session.expiresAt < new Date())
        throw new UnauthorizedException();

    const user = await this.usersService.findById(payload.sub);

    if (!user)
        throw new UnauthorizedException();

    if (!user.isActive)
        throw new UnauthorizedException();


  return {
    id: payload.sub,
    email: payload.email,
    roleId: payload.roleId,
    roleName: payload.roleName,
    organizationId: payload.organizationId,
    sessionId: payload.sessionId,
  };
}
}