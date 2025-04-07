import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

export function useUploadFileToS3(endpoint: string) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.data.imageUrl;
    },
    onError: (err) => {
      console.error("❌ 업로드 실패:", err);
      apiErrorMessage(err);
    },
    onSuccess: () => {
      message.success("이미지 업로드 성공");
    },
  });
}
