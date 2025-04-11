import { FormInstance, message } from "antd";

import { ApiResponse, ValidationError } from "@/types";

/**
 * API 요청 에러를 처리하는 함수
 * @param error API 요청 에러 객체
 * @param showMessage
 * @returns 에러 메시지 (if ture)
 */
export const apiErrorMessage = (
  error: unknown,
  showMessage: boolean = true,
): string | undefined => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: ApiResponse<ValidationError> } };
    const errorMessage = axiosError.response?.data?.message || "오류 발생. 다시 시도하세요.";
    if (showMessage) {
      message.error(errorMessage);
    }
    return errorMessage;
  }
};

/**
 * API 요청 에러를 처리하는 함수
 *
 * 이 함수는 API 요청 중 발생한 에러를 파싱하고,
 * `antd`의 `Form` 컴포넌트에 올바른 필드 에러를 설정합니다.
 *
 * @param error API 요청 에러 객체 (Axios 에러 객체 예상)
 * @param form `antd`의 FormInstance, 해당 폼의 필드 에러를 설정하는 데 사용됩니다.
 * @returns 에러 메시지를 반환하거나, `form` 필드에 에러를 표시합니다.
 */
export const applyApiValidationErrors = (error: unknown, form: FormInstance): boolean => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: ApiResponse<ValidationError[]> } };
    const validationErrors = axiosError.response?.data?.data;

    if (validationErrors && validationErrors.length > 0) {
      const errors = validationErrors.map((err) => {
        // 현재 `form`의 최상위 필드 목록 가져오기
        const formFields = Object.keys(form.getFieldsValue());
        const parentKey = formFields.find((key) => {
          const nestedFields = form.getFieldValue(key);
          return nestedFields && typeof nestedFields === "object" && err.field in nestedFields;
        });

        //  최상위 객체가 있으면 ["최상위객체", "필드명"], 없으면 그대로
        const fieldName: string | string[] = parentKey ? [parentKey, err.field] : err.field;
        return { name: fieldName, errors: [err.message] };
      });

      form.setFields(errors);
      return true; //  폼 에러가 있으면 true 반환
    }
  }
  return false; //  폼 에러가 없으면 false 반환
};
