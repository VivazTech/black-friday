"use client";

import { useState, type ToggleEvent } from "react";

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const onToggle = (index: number) => (event: ToggleEvent<HTMLDetailsElement>) => {
    if (event.currentTarget.open) setOpenIndex(index);
    else setOpenIndex((current) => (current === index ? -1 : current));
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question} open={openIndex === index} onToggle={onToggle(index)}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
