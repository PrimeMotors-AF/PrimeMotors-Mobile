import { Request, Response } from "express";
export declare const listFavoritesController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleFavoriteController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createFavoriteController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteFavoriteController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateFavoriteMessageController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
