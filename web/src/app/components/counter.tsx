"use client";

import { useState } from "react";

interface CounterProps {
  initialCount: number;
}

export default function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={() => setCount((value) => value + 1)}>Increment</button>
    </div>
  );
}
