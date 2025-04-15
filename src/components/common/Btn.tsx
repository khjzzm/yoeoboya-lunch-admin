"use client";

import { Button, ButtonProps } from "antd";
import classNames from "classnames";

type Visual = "primary" | "outline" | "danger" | "default";

interface VariantButtonProps extends ButtonProps {
  text: string;
  visual?: Visual;
}

export default function Btn({ visual = "primary", text, className, ...props }: VariantButtonProps) {
  const baseStyle = "text-sm font-semibold";

  const variantStyles: Record<Visual, string> = {
    primary: "bg-[#29367c] text-white",
    outline: "border border-[#29367c] text-[#29367c] bg-white",
    danger: "bg-[#ffecec] text-red-600",
    default: "",
  };

  const hoverStyles: Record<Visual, string> = {
    primary: "hover:!bg-[#1e2b5f] hover:!text-white hover:!border-[#1e2b5f]",
    outline: "hover:!bg-[#f0f0f0] hover:!text-[#29367c] hover:!border-[#29367c]",
    danger: "hover:!bg-[#ffd6d6] hover:!text-red-600 hover:!border-[#ffd6d6]",
    default: "",
  };

  return (
    <Button
      className={classNames(baseStyle, variantStyles[visual], hoverStyles[visual], className)}
      {...props}
    >
      {text}
    </Button>
  );
}
