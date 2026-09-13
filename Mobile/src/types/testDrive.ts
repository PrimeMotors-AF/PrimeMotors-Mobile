export interface TestDriveCarImage {
  id?: string;
  url: string;
  carId?: string;
}

export interface TestDriveCar {
  id: string;
  model: string;
  name: string;
  images: TestDriveCarImage[];
}

export interface TestDriveAppointment {
  id: string;
  scheduledAt: string;
  carId: string;
  userId: string;
  message?: string | null;
  status?: string;
  car?: TestDriveCar;
}

export interface CreateTestDrivePayload {
  carId: string;
  userId: string;
  scheduledAt: string;
  message?: string;
}

export interface UpdateTestDrivePayload {
  scheduledAt?: string;
  message?: string;
}

export interface TestDriveModalProps {
  carId: string;
  userId: string;
  onClose: () => void;
  agendamentoInicial?: TestDriveAppointment | null;
  isOpen?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onDelete?: () => Promise<void>;
}
