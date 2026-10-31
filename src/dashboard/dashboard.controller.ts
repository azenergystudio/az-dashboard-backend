import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Returns dashboard data for one building and an optional date range.
   *
   * Example:
   * GET /dashboard?buildingId=<id>&from=2026-11-28T00:00:00.000Z&to=2026-11-29T00:00:00.000Z
   */
  @Get()
  getDashboard(
    @Query('buildingId') buildingId: string,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.dashboardService.getDashboard({ buildingId, from, to }, user);
  }
}
