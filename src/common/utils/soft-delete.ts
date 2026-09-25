export async function softDelete(
  model: any,
  id: string,
) {
  return model.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}