interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const percentage = (current / max) * 100;

  const fillColor =
    current >= max
      ? "oklch(55% 0.18 27)" // red
      : current >= max * 0.9
        ? "oklch(80% 0.18 85)" // yellow
        : "oklch(60% 0.18 232)"; // blue

  return (
    <div
      className="relative w-full h-5 rounded-full border-2 overflow-hidden"
      style={{ borderColor: "rgb(59 130 246)" }}
    >
      {/* Fill */}
      <div
        className="absolute top-0 left-0 h-full transition-all duration-150"
        style={{
          width: `${percentage}%`,
          backgroundColor: fillColor,
        }}
      />

      {/* Label */}
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
        style={{
          color: percentage > 50 ? "white" : "var(--foreground)",
          mixBlendMode: "normal",
          zIndex: 1,
        }}
      >
        {current} / {max}
      </span>
    </div>
  );
}
