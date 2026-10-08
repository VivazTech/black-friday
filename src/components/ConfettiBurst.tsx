"use client";

import { useEffect, useRef, useState } from "react";

const colors = ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"];
const shapes = ["circle", "rect", "rect", "strip", "strip"] as const;
const keyframeCount = 40;
const popWindow = 0.08;

type ParticleShape = (typeof shapes)[number];

type Particle = {
  keyframes: { transform: string[]; opacity: number[] };
  duration: number;
  size: number;
  color: string;
  shape: ParticleShape;
};

function buildKeyframes({
  angle,
  startVelocity,
  decay,
  gravity,
  drift,
  wobbleSpeed,
  wobbleOffset,
  size,
  ticks,
  tiltRotations,
  rotation,
}: {
  angle: number;
  startVelocity: number;
  decay: number;
  gravity: number;
  drift: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  size: number;
  ticks: number;
  tiltRotations: number;
  rotation: number;
}) {
  const transforms: string[] = [];
  const opacities: number[] = [];
  let velocity = startVelocity;
  let x = 0;
  let y = 0;
  let wobble = wobbleOffset;
  let tick = 0;

  for (let i = 0; i <= keyframeCount; i++) {
    const t = i / keyframeCount;
    if (i > 0) {
      const targetTick = Math.round((i * ticks) / keyframeCount);
      while (tick < targetTick) {
        x += Math.cos(angle) * velocity + drift;
        y += Math.sin(angle) * velocity + gravity * 3;
        velocity *= decay;
        wobble += wobbleSpeed;
        tick++;
      }
    }
    const translateX = i === 0 ? 0 : x + Math.cos(wobble) * 15 * size;
    const translateY = y;
    let scale: number;
    if (t < popWindow * 0.6) scale = (t / (popWindow * 0.6)) * 1.15;
    else if (t < popWindow) scale = 1.15 - ((t - popWindow * 0.6) / (popWindow * 0.4)) * 0.15;
    else scale = 1;
    const tilt = tiltRotations * 360 * t;
    let opacity: number;
    if (t <= 0.5) opacity = 1;
    else if (t <= 0.8) opacity = 1 - ((t - 0.5) / 0.3) * 0.5;
    else opacity = 0.5 - ((t - 0.8) / 0.2) * 0.5;
    transforms.push(
      `translate(${translateX}px, ${translateY}px) scale(${scale}) rotateY(${tilt}deg) rotate(${rotation}deg)`,
    );
    opacities.push(opacity);
  }

  return { transform: transforms, opacity: opacities };
}

function createParticles(duration: number, particleCount: number, size: number) {
  const ticks = Math.round(duration * 60);
  const spread = 100;
  const startVelocity = 25;
  const decay = 0.91;
  const gravity = 1;
  const drift = 0;
  return Array.from({ length: particleCount }, (): Particle => {
    const spreadRad = spread * (Math.PI / 180);
    const angle = -Math.PI / 2 + (0.5 * spreadRad - Math.random() * spreadRad);
    const velocity = startVelocity * 0.5 + Math.random() * startVelocity;
    return {
      keyframes: buildKeyframes({
        angle,
        startVelocity: velocity,
        decay,
        gravity,
        drift,
        wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
        wobbleOffset: Math.random() * 10,
        size,
        ticks,
        tiltRotations: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
      }),
      duration,
      size: 6 * size + Math.random() * 6 * size,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  });
}

function ParticleDot({ particle }: { particle: Particle }) {
  const ref = useRef<HTMLDivElement>(null);
  const { keyframes, duration, size, color, shape } = particle;
  const width = shape === "strip" ? size * 0.3 : shape === "rect" ? size * 0.7 : size;
  const height = shape === "strip" ? size * 2 : size;
  const radius = shape === "circle" ? "50%" : shape === "strip" ? size * 0.12 : 2;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const playback = element.animate(keyframes, { duration: duration * 1000, easing: "linear", fill: "forwards" });
    return () => playback.cancel();
  }, [keyframes, duration]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: radius,
        backgroundColor: color,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    />
  );
}

/** Solta os confetes uma vez, a partir do centro do elemento pai. */
export function ConfettiBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 2.5;
    setParticles(createParticles(duration, 70, 1));
    const timer = window.setTimeout(() => setParticles([]), (duration + 0.5) * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-burst" aria-hidden="true">
      {particles.map((particle, index) => (
        <ParticleDot key={index} particle={particle} />
      ))}
    </div>
  );
}
