export interface Task {
  id: number;
  userId: number;   // ← este es el projectId
  title: string;
  completed: boolean;
}
