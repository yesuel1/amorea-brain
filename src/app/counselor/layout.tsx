import type { ReactNode } from "react";
import { CounselorHeader } from "@/components/counselor/CounselorHeader";

export default function CounselorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-vb-bg">
      <CounselorHeader />
      {children}
    </div>
  );
}
