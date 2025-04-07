import { Form, Radio } from "antd";

import { CategoryResponse } from "@/types";

interface CategorySelectProps {
  categories: CategoryResponse[];
}

export default function CategorySelect({ categories }: CategorySelectProps) {
  return (
    <Form.Item
      name="categoryId"
      label="카테고리"
      rules={[{ required: true, message: "카테고리를 선택하세요!" }]}
    >
      <Radio.Group optionType="button" buttonStyle="solid" className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Radio.Button key={cat.id} value={cat.id}>
            {cat.name}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}
