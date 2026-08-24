import { Prisma } from "@prisma/client";
import prisma from "../config/database";

type CarWithRelations = Prisma.CarGetPayload<{
  include: {
    brand: true;
    espec: true;
    images: true;
    category: true;
  };
}>;

type CarWithDetailRelations = Prisma.CarGetPayload<{
  include: {
    brand: true;
    espec: true;
    images: true;
    itens: true;
    category: true;
  };
}>;

// 1. Definição clara da função de formatação
const formatCar = (car: CarWithRelations) => ({
  id: car.id,
  name: car.name,
  brand: car.brand?.name || "Sem Marca",
  category: {
    name: car.category?.name || "Sem Categoria",
  },
  price: Number(car.value),
  imgUrl: car.images[0]?.url || "",
  year: car.espec.year,
  specs: {
    engine: car.espec.engine,
    fuel: car.espec.fuel,
    transmission: car.espec.transmission,
  },
});

// 2. Agora os exports estão no nível raiz do arquivo (correto)
export async function getCars(page = 1, limit = 100) {
  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 100;

  const cars = await prisma.car.findMany({
    skip: (validPage - 1) * validLimit,
    take: validLimit,
    include: {
      brand: true,
      espec: true,
      images: true,
      category: true,
    },
  });
  return cars.map(formatCar);
}
export async function getCarById(id: string) {
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      brand: true,
      espec: true,
      images: true,
      itens: true,
      category: true,
    },
  });

  if (!car) return null;

  const formatted = formatCar(car);

  // 1. Mapeamento de tradução para os itens técnicos do banco
  const itemLabels: { [key: string]: string } = {
    airbag: "Airbag",
    alarm: "Alarme",
    leather_seat: "Bancos de Couro",
    cruise_control: "Piloto Automático",
    abs: "Freios ABS",
    onBoard_computer: "Computador de Bordo",
  };

  // 2. Transformar o objeto de booleanos em um Array de strings
  const features = car.itens
    ? Object.entries(car.itens)
        .filter(([key, value]) => value === true && key !== "id") // Filtra apenas o que é true
        .map(([key]) => itemLabels[key] || key) // Traduz ou usa a chave original
    : [];

  return {
    ...formatted,
    model: car.model,
    allImages: car.images.map((img) => img.url),
    status: car.status,
    features, // Agora é um Array: ["Airbag", "Freios ABS", ...]
    specs: {
      ...formatted.specs,
      color: car.espec.color,
      potency: car.espec.potency,
      max_speed: car.espec.max_speed,
    },
  };
}
