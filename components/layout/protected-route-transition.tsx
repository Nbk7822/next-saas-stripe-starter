"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

interface ProtectedRouteTransitionProps {
  children: React.ReactNode;
}

export function ProtectedRouteTransition({
  children,
}: ProtectedRouteTransitionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const transitionKey = search ? `${pathname}?${search}` : pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
