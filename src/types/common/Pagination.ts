export interface Pagination {
  page: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SlicePagination {
  page: number; //현재 페이지의 번호를 반환합니다. 페이지 번호는 0부터 시작합니다.
  size: number; //페이지 당 데이터의 수를 반환합니다.
  numberOfElements: number; //현재 페이지에 있는 데이터의 수를 반환합니다.
  first: boolean; //현재 페이지가 첫 페이지인지 여부를 반환합니다.
  last: boolean; //현재 페이지가 마지막 페이지인지 여부를 반환합니다.
  hasNext: boolean; //다음 페이지가 있는지 여부를 반환합니다.
  hasPrevious: boolean; //이전 페이지가 있는지 여부를 반환합니다.
}
