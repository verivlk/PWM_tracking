export interface Course {
  id: string;
  title: string;
  acronym: string; // e.g., "PWM", "FSI" come da design
  description: string;
  imageUrl: string;
  isFavorite?: boolean; // Questo verrà calcolato unendo i dati Firebase con SQLite
}
