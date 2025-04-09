import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Form, Input, Row, Col, Tooltip } from "antd";
import type { FormInstance } from "antd/es/form";
import { useWatch } from "antd/es/form/Form";

interface SecretToggleProps {
  form: FormInstance;
}

export default function SecretToggle({ form }: SecretToggleProps) {
  const secret = useWatch("secret", { form });

  const handleToggle = () => {
    form.setFieldValue("secret", !secret);
  };

  return (
    <Form.Item label="비밀글 설정">
      <Row gutter={8} align="middle">
        <Col>
          <Tooltip title={secret ? "비밀글" : "공개글"}>
            <span
              onClick={handleToggle}
              style={{
                fontSize: 20,
                cursor: "pointer",
                color: secret ? "#1677ff" : "#999",
                display: "inline-block",
                width: 32,
                height: 32,
                lineHeight: "32px",
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: 6,
                userSelect: "none",
              }}
            >
              {secret ? <LockOutlined /> : <UnlockOutlined />}
            </span>
          </Tooltip>
          <Form.Item name="secret" valuePropName="checked" noStyle>
            <input type="checkbox" style={{ display: "none" }} />
          </Form.Item>
        </Col>

        {secret && (
          <Col>
            <Form.Item
              name="pin"
              noStyle
              validateTrigger="onBlur"
              rules={[
                { required: true, message: "비밀번호를 입력해주세요" },
                { pattern: /^\d{4}$/, message: "숫자 4자리를 입력해주세요" },
              ]}
            >
              <Input
                maxLength={4}
                placeholder="예: 1234"
                prefix={<LockOutlined />}
                type="tel"
                style={{
                  width: 120,
                  height: 32,
                  fontSize: 14,
                }}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form.Item>
  );
}
