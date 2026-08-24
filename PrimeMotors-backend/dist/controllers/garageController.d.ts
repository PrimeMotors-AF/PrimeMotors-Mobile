import { Request, Response } from "express";
export declare const createProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserProposals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
