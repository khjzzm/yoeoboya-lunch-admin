"use client";

import { Input, Select } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

import { AnonymousBoardCreate } from "@/types";

import Btn from "@/components/common/Btn";

import { useCreateAnonymousBoard } from "@/lib/queries";
import { getOrCreateAnonymousUUID } from "@/lib/utils/uuid";

const DELETE_OPTIONS = [
  { label: "10분 후 삭제", value: 11 },
  { label: "30분 후 삭제", value: 31 },
  { label: "1시간 이내 삭제", value: 61 },
  { label: "24시간 이내 삭제", value: 60 * 25 },
  { label: "일주일 이상 남음", value: 60 * 24 * 8 },
  { label: "한 달 이상 남음", value: 60 * 24 * 31 },
];

export default function AnonymousWrite() {
  const uuid = getOrCreateAnonymousUUID();

  const [form, setForm] = useState({
    nickname: "",
    password: "",
    content: "",
    deleteAt: "",
  });

  const { mutate: createPost, isPending } = useCreateAnonymousBoard();

  const handleInputChange = (key: keyof AnonymousBoardCreate, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    if (!form.content.trim()) return;

    createPost(
      {
        ...form,
        clientUUID: uuid,
        deleteAt: form.deleteAt || undefined,
      },
      {
        onSuccess: () => setForm((prev) => ({ ...prev, content: "" })),
      },
    );
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3 text-xs text-gray-500">
        <Input
          size="small"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => handleInputChange("nickname", e.target.value)}
          className="flex-1"
        />
        <Input.Password
          size="small"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="flex-1"
        />
        <Select
          size="small"
          placeholder="삭제 예약"
          options={DELETE_OPTIONS}
          className="flex-1 min-w-[150px]"
          onChange={(min) =>
            handleInputChange("deleteAt", dayjs().add(min, "minute").toISOString())
          }
        />
      </div>

      <textarea
        rows={3}
        placeholder="하고 싶은 말을 익명으로 남겨보세요."
        value={form.content}
        onChange={(e) => handleInputChange("content", e.target.value)}
        className="w-full p-3 border-none bg-transparent resize-none focus:outline-none"
      />

      <div className="flex justify-end mt-2">
        <Btn text="등록" onClick={handleCreate} loading={isPending} />
      </div>
    </div>
  );
}
