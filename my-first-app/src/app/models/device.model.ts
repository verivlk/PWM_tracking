export interface LocalizationDevice {
  id?: string; // id dodawane przez { idField: 'id' }
  lat: number;
  lon: number;
  worker_id: string;
}