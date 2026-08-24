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
        fuel: import(".prisma/client").$Enums.FuelType;
        transmission: string;
    };
}[]>;
export declare function getCarById(id: string): Promise<{
    model: string;
    allImages: string[];
    status: import(".prisma/client").$Enums.CarStatus;
    features: string[];
    specs: {
        color: string;
        potency: string;
        max_speed: string;
        engine: string;
        fuel: import(".prisma/client").$Enums.FuelType;
        transmission: string;
    };
    id: string;
    name: string;
    brand: string;
    category: {
        name: string;
    };
    price: number;
    imgUrl: string;
    year: number;
} | null>;
