import type { ReactNode } from "react";

export type InputProps = {
  texto?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
};

export interface Review {
  //Reviews Carrossel Home
  id: number;
  name: string;
  content: string;
  carPurchased: string;
  img: string;
  stars: number;
}

export interface CardCarProps {
  id: string;
  brand?: string; // Já está opcional, isso resolve o erro da imagem 1
  name: string;
  model: string;
  price: number;
  imgUrl: string;
  allImages: string[];
  category?: {
    id: string;
    name: string;
  }; 
  year?: string;
  specs?: {
    engine?: string;
    drive?: string;
    transmission: string;
    fuel?: string;
    potency: string;
    max_speed?: number;
    zeroToHundred?: number;
    color?: string; 
  };
  features?: string[]; // Já está opcional
}
export interface AvatarUploadFormProps {
  onUpload: (url: string) => void;
}
export interface CardGarageProps extends CardCarProps {
  status: 'Processando' | 'Entregue' | 'Cancelado';
  purchaseDate: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  password: string;
  number: string;
  avatarUrl?: string | null;
}

export interface EditConfig {
  label: string;
  type?: string;
  defaultValue?: string;
  maxLength?: number;
}

export interface UserData {
  name: string;
  email: string;
  cep: string;
  cpf: string;
  number: string;
}

export interface InfoRowProps {
  label: string;
  value: string;
  onEdit?: () => void;
}

export interface FavoriteData {
  userId: string;
  carId: string;
}

export interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  userId: string;
}

export interface GarageProposalPayload {
  offeredValue: number;
  message: string;
  carId: string;
  userId: string;
}

export interface GarageProposalModalProps {
  isOpen: boolean;
  offeredValue: number;
  message?: string;
  onClose: () => void;
  onSave: (offeredValue: number, message: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export interface SpecDescriptionProps {
  titulo: string;
  valor: string | number | undefined;
}

export interface CardGarageProps {
  id: string;
  name: string;
  imgUrl: string;
  offeredValue: number;
  status: 'Processando' | 'Entregue' | 'Cancelado';
  message?: string;
  brand?: string;
  favoriteId?: string;
  date_offer?: string;
}

// testDrive Props
 
export interface TestDriveData {
  id: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Realizado';
  message: string | null;
  carId: string;
  userId: string;
  car?: {
    name: string;
    model: string;
    images?: Array<{ url: string }>;
  };
}

export interface TestDriveCardProps {
  agendamento: TestDriveData;
  onDeleteSuccess: () => void;
}

export interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  userId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  
}