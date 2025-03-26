export default interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}


// 벨리데이션 정보
export interface ValidationError {
  field: string;
  message: string;
}
