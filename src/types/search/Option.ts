import {BoardSearchType} from "@/types";

export const BoardSearchOptions: { label: string; value: BoardSearchType }[] = [
  {label: "제목+내용", value: BoardSearchType.TITLE_CONTENT},
  {label: "제목", value: BoardSearchType.TITLE},
  {label: "내용", value: BoardSearchType.CONTENT},
  {label: "작성자", value: BoardSearchType.AUTHOR},
  {label: "댓글", value: BoardSearchType.COMMENT},
];

export const roleOptions = [
  {label: "어드민", value: "ROLE_ADMIN"},
  {label: "매니저", value: "ROLE_MANAGER"},
  {label: "유저", value: "ROLE_USER"},
  {label: "게스트", value: "ROLE_GUEST"},
  {label: "차단", value: "ROLE_BLOCK"},
];

export const MemberSearchOptions = [
  { label: "로그인 ID", value: "loginId" },
  { label: "이름", value: "name" },
]

export const AuthoritiesOptions = [
  { label: "로그인 ID", value: "loginId" },
  { label: "이름", value: "name" },
  { label: "역할", value: "authority" },
]