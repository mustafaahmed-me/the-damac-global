import type { ReactNode } from "react";

// Templates remount on every navigation, so each page gets a soft entrance
// transition. The animation is disabled automatically for reduced motion.
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
