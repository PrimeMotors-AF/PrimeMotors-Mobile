export declare function getFavoritesByUser(userId: string, page?: number, limit?: number): Promise<{
    id: string;
    favoriteId: string;
    carId: string;
    name: string;
    brand: string;
    imgUrl: string;
    offeredValue: number;
    message: string | null;
    createdAt: Date;
}[]>;
export declare function createFavorite(userId: string, carId: string, message?: string): Promise<{
    id: string;
    carId: string;
    createdAt: Date;
    message: string | null;
    userId: string;
}>;
export declare function deleteFavorite(userId: string, carId: string): Promise<{
    id: string;
    carId: string;
    createdAt: Date;
    message: string | null;
    userId: string;
} | null>;
export declare function findFavorite(userId: string, carId: string): Promise<{
    id: string;
    carId: string;
    createdAt: Date;
    message: string | null;
    userId: string;
} | null>;
export declare function updateFavoriteMessage(favoriteId: string, userId: string, message: string): Promise<{
    id: string;
    carId: string;
    createdAt: Date;
    message: string | null;
    userId: string;
} | null>;
