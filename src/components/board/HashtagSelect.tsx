import { CloseOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Form, message, Select, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import { useFreeBoardHashTagSearch, useFreeBoardPopularHashtags } from "@/lib/queries";
import {
  addRecentHashtag,
  clearRecentHashtags,
  getRecentHashtags,
  removeRecentHashtag,
} from "@/lib/utils/localRecentTags";

interface HashtagSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
}

export default function HashtagSelect({ value = [], onChange, maxCount = 10 }: HashtagSelectProps) {
  const [input, setInput] = useState("");
  const [recentTags, setRecentTags] = useState<string[]>([]);

  const { data: suggestions, isLoading: isSuggestLoading } = useFreeBoardHashTagSearch(input);
  const { data: popularTags, isLoading: isPopularLoading } = useFreeBoardPopularHashtags();

  useEffect(() => {
    setRecentTags(getRecentHashtags());
  }, [input]);

  const currentOptions = (input.length > 0 ? suggestions : popularTags)
    .filter((tag) => tag?.tag)
    .map((tag) => ({
      label: `${tag.tag} (${tag.count})`,
      value: tag.tag,
      disabled: value.length >= maxCount,
    }));

  const handleDeleteRecent = (tag: string) => {
    removeRecentHashtag(tag);
    setRecentTags(getRecentHashtags());
    message.success(`"${tag}" 태그 삭제됨`);
  };

  const handleClearRecent = () => {
    clearRecentHashtags();
    setRecentTags([]);
    message.success("최근 태그 전체 삭제됨");
  };

  const handleCopyAllRecentTags = async () => {
    if (recentTags.length === 0) return;
    const commaSeparated = recentTags.join(",");
    try {
      await navigator.clipboard.writeText(commaSeparated);
      message.success(`최근 태그 전체 복사됨 (${recentTags.length}개)`);
    } catch (err) {
      message.error(`복사 실패 😢 ${err}`);
    }
  };

  return (
    <Form.Item
      name="hashTag"
      label="해시태그 (최대 10개, 콤마로 구분)"
      tooltip="예: 일상, 개발, 여행"
    >
      <Select
        mode="tags"
        tokenSeparators={[","]}
        placeholder="해시태그를 입력하세요"
        value={value}
        onChange={(val) => {
          if (val.length > maxCount) {
            message.warning(`최대 ${maxCount}개까지만 입력할 수 있습니다`);
            const trimmed = val.slice(0, maxCount);
            trimmed.forEach((tag) => addRecentHashtag(tag));
            onChange?.(trimmed);
          } else {
            val.forEach((tag) => addRecentHashtag(tag));
            onChange?.(val);
          }
        }}
        onSearch={setInput}
        onFocus={() => {
          if (input.length === 0) setInput("");
        }}
        options={currentOptions}
        filterOption={false}
        maxTagCount={maxCount}
        allowClear
        style={{ width: "100%" }}
        notFoundContent={
          input.length === 0 ? (
            isPopularLoading ? (
              <Spin size="small" />
            ) : (
              "추천 태그 없음"
            )
          ) : isSuggestLoading ? (
            <Spin size="small" />
          ) : (
            "추천 태그 없음"
          )
        }
        dropdownRender={(menu) => (
          <>
            {menu}

            {/* 🔥 인기 태그 */}
            {input.length === 0 && popularTags.length > 0 && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ padding: "8px 12px" }}>
                  <Typography.Text type="secondary">🔥 인기 태그</Typography.Text>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {popularTags.map((tag) => (
                      <span
                        key={"popular-" + tag.tag}
                        style={{
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          borderRadius: 4,
                          display: "inline-block",
                          opacity: value.length >= maxCount ? 0.4 : 1,
                        }}
                      >
                        #{tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 🕘 최근 사용 태그 */}
            {input.length === 0 && recentTags.length > 0 && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography.Text type="secondary">🕘 최근 사용 태그</Typography.Text>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleCopyAllRecentTags}
                      >
                        전체 복사
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleClearRecent}
                      >
                        전체 삭제
                      </Button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {recentTags.map((tag) => (
                      <span
                        key={"recent-" + tag}
                        style={{
                          background: "#e6f7ff",
                          padding: "4px 8px",
                          borderRadius: 4,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        #{tag}
                        <CloseOutlined
                          style={{ fontSize: 10, cursor: "pointer", color: "#999" }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteRecent(tag);
                          }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      />
    </Form.Item>
  );
}
