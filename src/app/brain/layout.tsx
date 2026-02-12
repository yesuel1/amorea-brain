import type { ReactNode } from "react";
import { BrainHeader } from "@/components/brain/BrainHeader";

export default function BrainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-vb-bg">
      <BrainHeader />
      <main>{children}</main>
    </div>
  );
}
