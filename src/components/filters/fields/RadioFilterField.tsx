import { Radio } from "antd";

import { SearchOption } from "@/types";

interface RadioFilterFieldProps {
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function RadioFilterField({ options, value, onChange }: RadioFilterFieldProps) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      optionType="button"
      buttonStyle="solid"
    >
      {options.map((opt) => (
        <Radio.Button key={opt.value} value={opt.value}>
          {opt.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
