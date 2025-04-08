import { Input } from "antd";

interface TextFilterFieldProps {
  value: string;
  onChange: (val: string) => void;
  onEnter?: () => void; // 추가!
}

export default function TextFilterField({ value, onChange, onEnter }: TextFilterFieldProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onPressEnter={onEnter}
      placeholder="검색어 입력"
      allowClear
    />
  );
}
