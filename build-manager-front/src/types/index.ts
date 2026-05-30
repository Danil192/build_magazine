export interface WorkType {
  id: number;
  name: string;
  unit: string;
}

export interface WorkLog {
  id: number;
  work_date: string;
  work_type: number;
  work_type_details?: WorkType;
  volume: string;
  executor: string;
}