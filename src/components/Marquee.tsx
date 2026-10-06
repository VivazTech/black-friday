"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface MarqueeProps {
  /** Prefixo das classes e variáveis do CSS: `badges` ou `pattern`. */
  name: "badges" | "pattern";
  containerClass: string;
  /** Pixels por segundo. */
  speed: number;
  label?: string;
  children: ReactNode;
  /** Conteúdo das cópias, sem texto alternativo, para leitores de tela não repetirem. */
  copy: ReactNode;
}

// Repete o grupo até cobrir a largura da tela; a animação do CSS desloca exatamente um grupo.
export function Marquee({ name, containerClass, speed, label, children, copy }: MarqueeProps) {
  const container = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ copies: 2, width: 0 });

  useEffect(() => {
    const measure = () => {
      const width = group.current?.getBoundingClientRect().width ?? 0;
      if (!width || !container.current) return;
      const copies = Math.max(2, Math.ceil(container.current.clientWidth / width));
      setSize((previous) =>
        previous.copies === copies && previous.width === width ? previous : { copies, width },
      );
    };
    // Primeira medição imediata, como no script original; o observer cuida dos redimensionamentos.
    measure();
    const observer = new ResizeObserver(measure);
    if (container.current) observer.observe(container.current);
    if (group.current) observer.observe(group.current);
    return () => observer.disconnect();
  }, []);

  const Group = name === "pattern" ? "span" : "div";
  const style = size.width
    ? ({
        [`--${name}-distance`]: `${size.width}px`,
        [`--${name}-duration`]: `${size.width / speed}s`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={container}
      className={containerClass}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className={`${name}-track`} style={style}>
        <Group ref={group as never} className={`${name}-group`}>
          {children}
        </Group>
        {Array.from({ length: size.copies }, (_, index) => (
          <Group key={index} className={`${name}-group`} aria-hidden="true">
            {copy}
          </Group>
        ))}
      </div>
    </div>
  );
}
