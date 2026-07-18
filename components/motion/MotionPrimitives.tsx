"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  fadeIn,
  fadeUp,
  motionTokens,
  staggerContainer,
  staggerItem,
} from "./motion-config";

type ChildrenProps = { children: ReactNode; className?: string };
type MotionDivProps = ComponentProps<typeof motion.div>;
type MotionButtonProps = ComponentProps<typeof motion.button>;

export function PageTransition({ children, className }: ChildrenProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-motion-safe-content
      className={className}
      variants={reduce ? fadeIn : fadeIn}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({
  children,
  className,
  id,
}: ChildrenProps & { id?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      data-motion-safe-content
      id={id}
      className={className}
      variants={reduce ? fadeIn : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.section>
  );
}

export function StaggerContainer({ children, className }: ChildrenProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-motion-safe-content
      className={className}
      variants={reduce ? fadeIn : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: ChildrenProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-motion-safe-content
      className={className}
      variants={reduce ? fadeIn : staggerItem}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className,
  ...props
}: ChildrenProps & Omit<MotionDivProps, "children">) {
  const reduce = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 240, damping: 24 });
  const rotateY = useSpring(rotateYValue, { stiffness: 240, damping: 24 });
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        rotateYValue.set(((event.clientX - rect.left) / rect.width - 0.5) * 3.5);
        rotateXValue.set(-((event.clientY - rect.top) / rect.height - 0.5) * 3.5);
      }}
      onPointerLeave={() => {
        rotateXValue.set(0);
        rotateYValue.set(0);
      }}
      whileHover={reduce ? undefined : { y: -7, scale: 1.008 }}
      transition={{
        duration: motionTokens.duration.fast,
        ease: motionTokens.ease,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({
  children,
  className,
  ...props
}: MotionButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      className={className}
      whileHover={reduce ? undefined : { y: -2, scale: 1.015 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: motionTokens.duration.fast }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function RevealText({ children, className }: ChildrenProps) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        data-motion-safe-content
        className="block"
        initial={reduce ? undefined : { y: "108%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
