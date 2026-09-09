import { ListQueryDto } from '../dto/list-query.dto';
export function buildPrismaQuery(
  query: ListQueryDto,
  searchableFields: string[] = [],
) {
  const where: Record<string, any> = {};

  if (query.search && searchableFields.length) {
    where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: query.search,
        mode: 'insensitive',
      },
    }));
  }

  return {
    skip: (query.page - 1) * query.limit,
    take: query.limit,
    where,
    orderBy: {
      [query.sortBy]: query.order,
    },
  };
}