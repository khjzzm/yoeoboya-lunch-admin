"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface YeoboyaLogoProps {
  size?: LogoSize;
  color?: string;
  className?: string; // 내부 텍스트용
  containerClassName?: string; // 바깥 div용
  onClick?: () => void;
}

const sizeMap: Record<LogoSize, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl",
};

export default function YeoboyaLogo({
  size = "sm",
  color = "text-[#1677ff]",
  className,
  containerClassName,
  onClick,
}: YeoboyaLogoProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={clsx("text-center", containerClassName)}>
      <span
        onClick={handleClick}
        className={clsx(
          "font-bold uppercase tracking-tight cursor-pointer",
          sizeMap[size],
          color,
          className,
        )}
        style={{ fontFamily: "Arial, sans-serif", letterSpacing: "-0.05em" }}
      >
        YEOBOYA LUNCH
      </span>
    </div>
  );
}
