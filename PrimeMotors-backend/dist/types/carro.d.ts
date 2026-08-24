export interface CardCarProps {
    id: string;
    brand: string;
    name: string;
    price: number;
    imgUrl: string;
    category?: string;
    year?: string;
    specs?: {
        engine?: string;
        drive?: string;
        transmission: string;
        fuel?: string;
        maxSpeed?: number;
        zeroToHundred?: number;
    };
    features?: string[];
}
