import { NotFoundException } from '@nestjs/common';

export async function findOrThrow(
  query: Promise<any>,
  message: string,
) {
  const result = await query;

  if (!result) {
    throw new NotFoundException(
      message,
    );
  }

  return result;
}