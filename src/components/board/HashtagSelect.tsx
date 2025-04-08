import { Form, Select, Spin, Divider, Typography, message, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { CopyOutlined } from "@ant-design/icons";

import { useFreeBoardHashTagSearch, useFreeBoardPopularHashtags } from "@/lib/queries";
import { addRecentHashtag, getRecentHashtags } from "@/lib/utils/localRecentTags";

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
    }));

  const handleCopy = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(`#${tag}`);
      message.success(`해시태그 #${tag} 복사됨`);
    } catch (err) {
      message.error("복사 실패 😢");
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
          val.forEach((tag) => addRecentHashtag(tag));
          onChange?.(val);
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
                      <Tooltip title="클릭 시 복사" key={"popular-" + tag.tag}>
                        <span
                          style={{
                            background: "#f0f0f0",
                            padding: "4px 8px",
                            borderRadius: 4,
                            cursor: "copy",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          onClick={() => handleCopy(tag.tag)}
                        >
                          #{tag.tag}
                          <CopyOutlined style={{ fontSize: 12, color: "#888" }} />
                        </span>
                      </Tooltip>
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
                  <Typography.Text type="secondary">🕘 최근 사용 태그</Typography.Text>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {recentTags.map((tag) => (
                      <Tooltip title="클릭 시 복사" key={"recent-" + tag}>
                        <span
                          style={{
                            background: "#e6f7ff",
                            padding: "4px 8px",
                            borderRadius: 4,
                            cursor: "copy",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          onClick={() => handleCopy(tag)}
                        >
                          #{tag}
                          <CopyOutlined style={{ fontSize: 12, color: "#888" }} />
                        </span>
                      </Tooltip>
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