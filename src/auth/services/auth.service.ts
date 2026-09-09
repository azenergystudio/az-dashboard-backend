import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response.interface';

import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { console } from 'inspector/promises';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    
    console.log('========== LOGIN START ==========');
    console.log('Email:', loginDto.email);
    const user = await this.validateUser(loginDto);

    const session = await this.sessionsService.createPendingSession(
      user.id,
    );

    const tokens =
      await this.tokenService.generateTokens({
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
        organizationId: user.organizationId,
        sessionId: session.id,
      });

    const hashedRefreshToken =
      await this.passwordService.hash(tokens.refreshToken);

    await this.sessionsService.updateRefreshToken(
      session.id,
      hashedRefreshToken,
    );
    

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.configService.getOrThrow(
        'JWT_EXPIRES_IN',
      ),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,

        role: {
          id: user.role.id,
          name: user.role.name,
        },

        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
            }
          : null,
      },
    };
  }

  async refresh(refreshToken: string) {
  const payload =
    await this.tokenService.verifyRefreshToken(refreshToken);
    console.log('Refresh Token Payload:', payload);

  const session =
    await this.sessionsService.findSession(payload.sessionId);
    console.log('Session Found for Refresh:', !!session);

  if (!session)
    throw new UnauthorizedException();

  const valid =
    await this.passwordService.compare(
      refreshToken,
      session.refreshToken,
    );

  if (!valid)
    throw new UnauthorizedException();

  const user =
    await this.usersService.findById(payload.sub);
    console.log('User Found for Refresh:', !!user);

  if (!user)
    throw new UnauthorizedException();

  const tokenPair =
    await this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      organizationId: user.organizationId,
      sessionId: session.id,
    });
    console.log('Generated Token Pair:', tokenPair);
  
  await this.sessionsService.updateRefreshToken(
    session.id,
    await this.passwordService.hash(tokenPair.refreshToken),
  );

  return tokenPair;
}

  private async validateUser(loginDto: LoginDto) {
    const user =
      await this.usersService.findByEmail(loginDto.email);
     console.log('User Found:', !!user);
    if (!user) {
       console.log('❌ User not found');
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordMatches =
      await this.passwordService.compare(
        loginDto.password,
        user.password,
      );
      console.log('Password Valid:', passwordMatches);

    if (!passwordMatches) {
      console.log('❌ Password mismatch');
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }
    console.log('Role Active:', user.role.isActive);
console.log(
  'Organization Active:',
  user.organization ? user.organization.isActive : 'No organization',
);

    if (!user.isActive) {
      throw new ForbiddenException(
        'User account is inactive',
      );
    }

    if (!user.role.isActive) {
      throw new ForbiddenException(
        'User role is inactive',
      );
    }

    if (
      user.organization &&
      !user.organization.isActive
    ) {
      throw new ForbiddenException(
        'Organization is inactive',
      );
    }

    return user;
  }

  async logout(sessionId: string) {
  await this.sessionsService.deleteSession(sessionId);

  return {
    message: 'Logged out successfully',
  };
}

async me(userId: string) {
  const user = await this.usersService.findById(userId);

  if (!user) {
    throw new UnauthorizedException();
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,

    role: {
      id: user.role.id,
      name: user.role.name,
    },

    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
        }
      : null,

    permissions: user.permissions.map((p) => ({
      id: p.permission.id,
      name: p.permission.name,
      module: p.permission.module,
    })),
  };
}
}