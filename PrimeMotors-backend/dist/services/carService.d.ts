import { Prisma } from "@prisma/client";
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
declare const formatCar: (car: CarWithRelations) => {
    id: string;
    name: string;
    brand: string;
    category: {
        name: string;
    };
    price: number;
    imgUrl: string;
    year: number;
    specs: {
        engine: string;
        fuel: import("@prisma/client").$Enums.FuelType;
        transmission: string;
    };
};
type DetailedCar = ReturnType<typeof formatCar> & {
    model: string;
    allImages: string[];
    status: CarWithDetailRelations["status"];
    features: string[];
    specs: ReturnType<typeof formatCar>["specs"] & {
        color: string;
        potency: string;
        max_speed: string;
    };
};
export declare function getCars(page?: number, limit?: number): Promise<{
    id: string;
    name: string;
    brand: string;
    category: {
        name: string;
    };
    price: number;
    imgUrl: string;
    year: number;
    specs: {
        engine: string;
        fuel: import("@prisma/client").$Enums.FuelType;
        transmission: string;
    };
}[]>;
export declare function getCarById(id: string): Promise<DetailedCar | null>;
export {};
