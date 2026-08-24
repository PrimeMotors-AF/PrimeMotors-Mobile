export interface CardCarProps { 
  id: string;
  brand: string;      // Ex: "Porsche"
  name: string;       // O nome real do carro (Ex: "911 Carrera GTS")
  price: number;
  imgUrl: string;
  category?: string;   // Ex: "Esportivo"
  year?: string;
  specs?: {
    engine?: string;   // Ex: "4.0 V8"
    drive?: string;    // Ex: "4x4"
    transmission: string; // Ex: "Automático"
    fuel?:string; // flex / gasolina / diesel
    maxSpeed?:number;
    zeroToHundred?:number; 
  }
  features?: string[]; // Ex: "Teto Solar","Banco De Couro","Blindado"
}
