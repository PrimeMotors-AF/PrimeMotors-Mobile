import { Request, Response } from "express";
export declare const createTestDriveController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listTestDrivesController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTestDriveController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTestDriveController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
