import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createPendingSession(userId: string) {
    return this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: '__PENDING__',

        expiresAt: new Date(
          Date.now() +
            30 * 24 * 60 * 60 * 1000,
        ),
      },
    });
  }

  async updateRefreshToken(
    sessionId: string,
    hashedToken: string,
  ) {
    return this.prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async findSession(id: string) {
    return this.prisma.userSession.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteSession(id: string) {
    return this.prisma.userSession.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllUserSessions(userId: string) {
    return this.prisma.userSession.deleteMany({
      where: {
        userId,
      },
    });
  }
}