"use client";

import { useState, type MouseEvent } from "react";

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const onSummaryClick = (index: number) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const summary = event.currentTarget;
    const top = summary.getBoundingClientRect().top;

    setOpenIndex((current) => (current === index ? -1 : index));

    // No mobile, fechar a pergunta de cima muda a altura e a tela "pula".
    // Mantém a pergunta clicada na mesma posição visual após o React pintar.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const delta = summary.getBoundingClientRect().top - top;
        if (Math.abs(delta) > 1) window.scrollBy(0, delta);
      });
    });
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question} open={openIndex === index}>
          <summary onClick={onSummaryClick(index)}>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
