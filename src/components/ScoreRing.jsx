const ScoreRing = ({ score = 0, size = 148, label = "Score" }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" height={size} viewBox="0 0 140 140" width={size}>
        <circle
          cx="70"
          cy="70"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          className="text-zinc-200 dark:text-zinc-800"
        />
        <circle
          cx="70"
          cy="70"
          fill="none"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="12"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="52%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">{score}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      </div>
    </div>
  );
};

export default ScoreRing;
