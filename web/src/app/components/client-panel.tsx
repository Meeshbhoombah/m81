"use client";

import { useState, type ReactNode } from "react";

interface ClientPanelProps {
  children: ReactNode;
}

export default function ClientPanel({ children }: ClientPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen((value) => !value)}>
        {open ? "Hide content" : "Show content"}
      </button>

      {open && <div>{children}</div>}
    </div>
  );
}
