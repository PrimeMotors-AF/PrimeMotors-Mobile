export declare function getCachedCarResult<T>(key: string): Promise<T | null>;
export declare function setCachedCarResult<T>(key: string, value: T): Promise<void>;
export declare function invalidateCarCache(): Promise<void>;
