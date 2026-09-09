import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    expiresAt: Date,
  ) {
    return this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: '__PENDING__',
        expiresAt,
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

  async findById(sessionId: string) {
    return this.prisma.userSession.findUnique({
      where: {
        id: sessionId,
      },
    });
  }
  async findByUser(userId: string) {
  return this.prisma.userSession.findMany({
    where: {
      userId,
    },
  });
}

  async delete(sessionId: string) {
    return this.prisma.userSession.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteAll(userId: string) {
    return this.prisma.userSession.deleteMany({
      where: {
        userId,
      },
    });
  }
}