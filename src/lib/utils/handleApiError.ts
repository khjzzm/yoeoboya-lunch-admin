import {FormInstance, message} from "antd";
import {ValidationResponse} from "@/interfaces/response";


/**
 * API 요청 에러를 처리하는 함수
 * @param error API 요청 에러 객체
 * @param showMessage
 * @param form (선택) FormInstance, 폼 에러를 세팅하고 싶을 경우
 * @returns 에러 메시지 (있다면)
 */
export const handleApiError = (
  error: unknown,
  showMessage: boolean = true,
  form?: FormInstance,
): string | undefined => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: ValidationResponse } };
    const validationErrors = axiosError.response?.data?.validation;

    if (validationErrors && validationErrors.length > 0) {
      const errors = validationErrors.map((err) => ({
        name: err.field, // 필드 이름
        errors: [err.message], // 해당 필드 에러 메시지
      }));
      if (form) {
        form.setFields(errors);
      } else if (showMessage) {
        message.error("입력한 값이 올바르지 않습니다.");
      }
      return; // 폼 에러가 있는 경우, 추가 메시지 없이 종료
    } else {
      const errorMessage = axiosError.response?.data?.message || "오류 발생. 다시 시도하세요.";
      if (showMessage) {
        message.error(errorMessage);
      }
      return errorMessage;
    }
  } else {
    console.log("error");
  }
};