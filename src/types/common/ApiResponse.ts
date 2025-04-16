export interface ApiResponse<T> {
  code: number;
  message: string;
  detail?: string;
  data: T;
}
