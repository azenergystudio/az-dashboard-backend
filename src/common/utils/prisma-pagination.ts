import { PrismaService } from '../../prisma/prisma.service';

interface PaginatedQuery {
  skip: number;
  take: number;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

export async function prismaPaginate(
  prisma: PrismaService,
  model: any,
  query: PaginatedQuery,
) {
  const { where = {}, ...findManyQuery } = query;

  const [items, total] =
    await prisma.$transaction([
      model.findMany({
        ...findManyQuery,
        where,
      }),

      model.count({
        where,
      }),
    ]);

  const page =
    Math.floor(query.skip / query.take) + 1;

  return {
    items,
    total,
    page,
    limit: query.take,
    totalPages: Math.ceil(
      total / query.take,
    ),
  };
}