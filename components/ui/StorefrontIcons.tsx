"use client";

import { ArrowRight, Heart } from "lucide-react";

type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function ArrowRightIcon(props: IconProps) {
  return <ArrowRight {...props} />;
}

export function HeartIcon(props: IconProps) {
  return <Heart {...props} />;
}
