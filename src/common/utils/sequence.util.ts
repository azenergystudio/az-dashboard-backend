// common/utils/sequence.util.ts

import { PrismaService } from 'src/prisma/prisma.service';

export async function getNextSeqNo(
  prisma: PrismaService,
  model: keyof PrismaService,
): Promise<number> {
  const last = await (prisma[model] as any).findFirst({
    orderBy: {
      seqNo: 'desc',
    },
  });

  return (last?.seqNo ?? 0) + 1;
}