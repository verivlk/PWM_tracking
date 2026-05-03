export interface Team {
  id?: string;
  name: string;
  description?: string;
  managerId: string;  // each team has to have a manager
}
