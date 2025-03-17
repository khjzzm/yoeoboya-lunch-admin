interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResponse {
  code: number;
  message: string;
  validation?: ValidationError[];
}
