"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export interface BarChartDatum {
  name: string
  value: number
}

export interface PieChartDatum {
  name: string
  value: number
  color: string
}

// 1. Reusable Bar Chart Card (for weekly orders, revenue, categories, etc.)
export function OverviewBarChart({
  title,
  subtitle,
  data,
  barColor = "#ea580c",
}: {
  title: string
  subtitle: string
  data: BarChartDatum[]
  barColor?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-5">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="value" fill={barColor} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// 2. Reusable Donut/Pie Chart Card (for order status or role breakdown)
export function OverviewPieChart({
  title,
  subtitle,
  data,
}: {
  title: string
  subtitle: string
  data: PieChartDatum[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Simple Legend Below Chart */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-bold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
