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

export const ScoreTrendChart = ({ data = [] }) => {
  return (
    <Card className="min-h-[320px]">
      <div className="mb-6">
        <h2 className="text-base font-extrabold tracking-tight text-zinc-950 dark:text-white">Score momentum</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Recent analysis quality</p>
      </div>
      <div className="h-56 min-w-0">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data.length ? data : [{ date: "No data", score: 0 }]}>
            <defs>
              <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.18)" />
            <XAxis dataKey="date" stroke={chartText} tickLine={false} />
            <YAxis domain={[0, 100]} stroke={chartText} tickLine={false} />
            <Tooltip
              contentStyle={{
                border: "1px solid rgba(113,113,122,0.22)",
                borderRadius: 8,
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)"
              }}
            />
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
  return (
    <Card className="min-h-[320px]">
      <div className="mb-6">
        <h2 className="text-base font-extrabold tracking-tight text-zinc-950 dark:text-white">Platform mix</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Analysis distribution</p>
      </div>
      <div className="h-56 min-w-0">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,113,122,0.18)" />
            <XAxis dataKey="platform" stroke={chartText} tickLine={false} />
            <YAxis allowDecimals={false} stroke={chartText} tickLine={false} />
            <Tooltip
              contentStyle={{
                border: "1px solid rgba(113,113,122,0.22)",
                borderRadius: 8,
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)"
              }}
            />
            <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
