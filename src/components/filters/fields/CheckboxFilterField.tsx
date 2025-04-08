import { Checkbox } from "antd";

interface Props {
  value: string[];
  options: { label: string; value: string }[];
  onChange: (checked: string[]) => void;
}

export default function CheckboxFilterField({ value, options, onChange }: Props) {
  return <Checkbox.Group options={options} value={value} onChange={onChange} />;
}
