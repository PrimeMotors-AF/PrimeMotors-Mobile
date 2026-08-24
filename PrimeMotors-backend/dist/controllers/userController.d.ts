import { Request, Response } from "express";
export declare const getUserController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUserController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUserController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
