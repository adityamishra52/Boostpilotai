import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import Card from "./Card";

const chartText = "#71717A";

const safeScoreData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [{ date: "No data", score: 0 }];
  }

  return data.map((item, index) => ({
    date: item.date || `#${index + 1}`,
    score: Number(item.score) || 0
  }));
};

const safePlatformData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [{ platform: "No data", count: 0 }];
  }

  return data.map((item) => ({
    platform: item.platform || "Unknown",
    count: Number(item.count) || 0
  }));
};

const tooltipStyle = {
  border: "1px solid rgba(113,113,122,0.22)",
  borderRadius: 12,
  boxShadow: "0 12px 32px rgba(0,0,0,0.12)"
};

export const ScoreTrendChart = ({ data = [] }) => {
  const chartData = safeScoreData(data);

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="mb-6 min-w-0">
        <h2 className="truncate text-base font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Score momentum
        </h2>
        <p className="truncate text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Recent analysis quality
        </p>
      </div>

      <div className="h-[260px] min-h-[260px] w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.18)" />

            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              minTickGap={18}
              stroke={chartText}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              stroke={chartText}
              tick={{ fontSize: 12 }}
              tickLine={false}
              width={36}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Area
              dataKey="score"
              fill="url(#scoreFill)"
              stroke="#06B6D4"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const PlatformBarChart = ({ data = [] }) => {
  const chartData = safePlatformData(data);

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="mb-6 min-w-0">
        <h2 className="truncate text-base font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Platform mix
        </h2>
        <p className="truncate text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Analysis distribution
        </p>
      </div>

      <div className="h-[260px] min-h-[260px] w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.18)" />

            <XAxis
              dataKey="platform"
              interval={0}
              minTickGap={12}
              stroke={chartText}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              stroke={chartText}
              tick={{ fontSize: 12 }}
              tickLine={false}
              width={36}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
