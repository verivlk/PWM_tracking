// src/app/models/worker.model.ts
export interface Worker {
  id?: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo?: string;
  info?: string;
  emContact?: string;

  active: boolean;  // at work?
  statusOk: boolean;  // is the worker ok?
  // status: 'active' | 'inactive';

  teamId: string; // each worker is exactly in one team
  managerId?: string;  // for better filtering
}
