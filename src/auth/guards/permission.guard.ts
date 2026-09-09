import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

import { AuthorizationService } from 'src/authorization/authorization.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // No permission required
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException();
    }

    // Super Admin bypass
    if (user.roleName === 'SUPER_ADMIN') {
      return true;
    }

  

    const permissionSet =
  await this.authorizationService.getPermissions(
    user.sub,
    user.roleId,
  );


    const hasPermission =
      requiredPermissions.every((permission) =>
        permissionSet.has(permission),
      );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Insufficient permissions.',
      );
    }

    return true;
  }
}