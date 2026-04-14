// src/app/models/worker.model.ts
export interface Worker {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  photo?: string;
}