import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Post,
} from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthRequest } from './types/auth-request-type';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


   @Post('login')
   @Public()
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponse> {
     console.log('Controller Login Hit');
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  async refresh(
  @Body() dto: RefreshTokenDto,
  ) {
     console.log('Refresh DTO:', dto);
  return this.authService.refresh(dto.refreshToken);
  }


  @UseGuards(JwtAuthGuard)
@Post('logout')
logout(
  @Req() req: AuthRequest,
) {
  return this.authService.logout(req.user.sessionId);
}

@UseGuards(JwtAuthGuard)
@Get('me')
me(
  @Req() req: AuthRequest,
) {
    
  return this.authService.me(req.user.id);
}
}