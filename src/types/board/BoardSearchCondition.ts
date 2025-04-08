export type BoardSearchCondition = {
  boardNo?: number;
  searchType?: BoardSearchType;
  keyword?: string;
};

export enum BoardSearchType {
  title_content = "title_content",
  title = "title",
  content = "content",
  author = "author",
  comment = "comment",
  category = "category",
  hashtag = "hashtag",
}
