export type BoardType = "FREE" | "NOTICE";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  boardType: BoardType;
}

export interface CategoryEditRequest {
  id: number;
  name: string;
  description?: string;
}
