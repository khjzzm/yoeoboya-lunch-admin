import { BoardSearchType } from "@/types";

export type SearchOption = { label: string; value: string };

export type FilterInputType = "text" | "checkbox" | "radio";

export interface SearchFilterOption {
  label: string;
  value: string;
  inputType: FilterInputType;
  options?: { label: string; value: string }[]; // checkbox, radio 전용 옵션
}

export const categoryOptions: SearchOption[] = [];

export const BoardSearchOptions: SearchFilterOption[] = [
  { label: "제목+내용", value: BoardSearchType.title_content, inputType: "text" },
  { label: "제목", value: BoardSearchType.title, inputType: "text" },
  { label: "내용", value: BoardSearchType.content, inputType: "text" },
  { label: "작성자", value: BoardSearchType.author, inputType: "text" },
  { label: "댓글", value: BoardSearchType.comment, inputType: "text" },
  {
    label: "카테고리",
    value: BoardSearchType.category,
    inputType: "checkbox",
    options: categoryOptions,
  },
  // { label: "해시태그", value: BoardSearchType.hashtag, inputType: "text" }, // 필요 시 활성화
];

export const MemberSearchOptions: SearchFilterOption[] = [
  { label: "로그인 ID", value: "loginId", inputType: "text" },
  { label: "이름", value: "name", inputType: "text" },
];

export const roleOptions: SearchOption[] = [
  { label: "어드민", value: "ROLE_ADMIN" },
  { label: "매니저", value: "ROLE_MANAGER" },
  { label: "유저", value: "ROLE_USER" },
  { label: "게스트", value: "ROLE_GUEST" },
  { label: "차단", value: "ROLE_BLOCK" },
  { label: "탈퇴", value: "ROLE_WITHDRAWN" },
];

export const AuthoritiesOptions: SearchFilterOption[] = [
  { label: "로그인 ID", value: "loginId", inputType: "text" },
  { label: "이름", value: "name", inputType: "text" },
  { label: "역할", value: "authority", inputType: "checkbox", options: roleOptions },
];
