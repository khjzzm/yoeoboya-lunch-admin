"use client";

import { Alert, Button, Form, Input, Radio } from "antd";
import { useEffect, useState } from "react";

import { useRandomKoreanName } from "@/lib/hooks/useRandomKoreanName";
import { useWithdraw } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

import { useAuthStore } from "@/store/useAuthStore";

export default function WithdrawNoticePage() {
  const withdrawMutation = useWithdraw();
  const nickName = useRandomKoreanName();
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const withdrawReasons = [
    "서비스 이용이 불편해요",
    "자주 사용하지 않아요",
    "원하는 기능이 없어요",
    "개인정보가 걱정돼요",
    "기타",
  ];

  const handleFinish = () => {
    form.validateFields().then((values) => {
      withdrawMutation.mutate(values, {
        onError: (error) => {
          if (applyApiValidationErrors(error, form)) return;
          const returnedError = apiErrorMessage(error, false);
          if (returnedError) setErrorMessage(returnedError);
        },
      });
    });
  };

  useEffect(() => {
    if (nickName) {
      form.setFieldsValue({ nickName });
    }
  }, [nickName, form]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-gray-800 text-sm space-y-12">
      {/* 유의사항 안내 */}
      <section>
        <h1 className="text-xl font-bold mb-2">회원탈퇴 유의사항</h1>
        <p>회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.</p>

        <div className="bg-gray-50 p-4 border border-gray-200 mt-4 rounded space-y-2">
          <p className="text-blue-600 ">
            ✔ 사용하고 계신 아이디(<span className="text-black font-bold">{user?.loginId}</span>)는
            탈퇴할 경우 복구가 불가능합니다.
          </p>
          <p className="text-sm text-gray-600">
            탈퇴된 아이디는 본인 확인을 포함한 타인의 모든 게시물 및 복구가 불가능하므로 신중하게
            선택해주세요. <br />
            <span className="text-orange-500 ">
              부정 가입 또는 부정 이용이 의심되는 아이디는 탈퇴 후 6개월간 동일한 신정정보로
              재가입할 수 없습니다.
            </span>
          </p>
        </div>
      </section>

      {/* 삭제 안내 */}
      <section>
        <h2 className="text-md font-bold mb-2">
          탈퇴 후 회원정보 및 개인정보 이용기록은 모두 삭제됩니다.
        </h2>
        <table className="w-full table-fixed border text-left text-sm bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 w-1/3">삭제 항목</th>
              <th className="border px-4 py-2">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">메일</td>
              <td className="border px-4 py-2">메일 계정 및 메일 삭제</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">계좌</td>
              <td className="border px-4 py-2">등록된 계좌 정보 삭제</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 탈퇴 후에도 남는 게시물 */}
      <section>
        <div className="bg-gray-50 p-4 border border-gray-200 rounded space-y-2">
          <p className="text-blue-600 ">
            ✔ 탈퇴 후에도 게시판형 서비스에 등록한 게시물은 그대로 남아 있습니다.
          </p>
          <p className="text-sm text-gray-600">
            공개된 서비스의 댓글 및 좋아요는 자동 삭제되지 않습니다. 반드시 직접 삭제하시거나 처리
            후 탈퇴해 주세요.
          </p>
        </div>

        <table className="w-full table-fixed border text-left text-sm mt-4 bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 w-1/3">서비스</th>
              <th className="border px-4 py-2">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">자유게시판</td>
              <td className="border px-4 py-2">게시글 및 댓글</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 탈퇴 폼 (사유만 노출) */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        validateTrigger="onBlur"
        initialValues={{
          loginId: user.loginId,
          email: user.email,
          provider: user.provider ?? "yeoboya",
          nickName: nickName,
        }}
      >
        <Form.Item
          label="탈퇴 사유"
          name="reason"
          rules={[{ required: true, message: "탈퇴 사유를 선택하거나 입력해주세요." }]}
        >
          <Radio.Group onChange={(e) => setSelectedReason(e.target.value)} value={selectedReason}>
            {withdrawReasons.map((reason) => (
              <Radio key={reason} value={reason}>
                {reason}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {selectedReason === "기타" && (
          <Form.Item
            name="reasonDetail"
            rules={[{ required: true, message: "기타 사유를 입력해주세요." }]}
          >
            <Input.TextArea rows={3} placeholder="기타 사유를 입력해주세요." />
          </Form.Item>
        )}

        {/* 히든 필드 */}
        <Form.Item name="loginId" hidden>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item name="email" hidden>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item name="provider" hidden>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item name="nickName" hidden>
          <Input readOnly disabled />
        </Form.Item>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-red-600 font-semibold mb-4">
            탈퇴 후에는 아이디 <strong>{user?.loginId}</strong>로 다시 가입할 수 없으며 <br />
            아이디와 데이터는 복구할 수 없습니다.
          </p>
          <Button htmlType="submit" type="primary" loading={withdrawMutation.isPending}>
            확인
          </Button>
        </div>
      </Form>
    </div>
  );
}
