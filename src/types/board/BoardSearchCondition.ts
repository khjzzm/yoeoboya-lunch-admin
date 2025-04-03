export type BoardSearchCondition = {
  boardId?: number;
  searchType?: BoardSearchType;
  keyword?: string;
};

export enum BoardSearchType {
  TITLE_CONTENT = "TITLE_CONTENT",
  TITLE = "TITLE",
  CONTENT = "CONTENT",
  AUTHOR = "AUTHOR",
  COMMENT = "COMMENT",
}
