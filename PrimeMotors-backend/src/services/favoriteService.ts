import prisma from "../config/database";

export async function getFavoritesByUser(userId: string, page = 1, limit = 10) {
  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      car: {
        include: {
          brand: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (validPage - 1) * validLimit,
    take: validLimit,
  });

  return favorites.map((favorite) => ({
    id: favorite.car.id,
    favoriteId: favorite.id,
    carId: favorite.carId,
    name: favorite.car.name,
    brand: favorite.car.brand.name,
    imgUrl: favorite.car.images[0]?.url || "/placeholder-car.png",
    offeredValue: Number(favorite.car.value),
    message: favorite.message,
    createdAt: favorite.createdAt,
  }));
}

export async function createFavorite(
  userId: string,
  carId: string,
  message?: string,
) {
  return prisma.favorite.create({
    data: {
      user: {
        connect: { id: userId },
      },
      car: {
        connect: { id: carId },
      },
      message,
    },
  });
}

export async function deleteFavorite(userId: string, carId: string) {
  const favorite = await prisma.favorite.findFirst({
    where: { userId, carId },
  });
  if (!favorite) return null;
  return prisma.favorite.delete({ where: { id: favorite.id } });
}

export async function findFavorite(userId: string, carId: string) {
  return prisma.favorite.findFirst({ where: { userId, carId } });
}

export async function updateFavoriteMessage(
  favoriteId: string,
  userId: string,
  message: string,
) {
  const favorite = await prisma.favorite.findFirst({
    where: { id: favoriteId, userId },
  });

  if (!favorite) return null;

  return prisma.favorite.update({
    where: { id: favoriteId },
    data: { message },
  });
}
