interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse {
  code: number;
  message: string;
  validation?: ValidationError[];
}
