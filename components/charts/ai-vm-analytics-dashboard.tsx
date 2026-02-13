"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const runtimeTrend = [
  { day: "Mon", runs: 68, vmHours: 52, tokensK: 420 },
  { day: "Tue", runs: 72, vmHours: 56, tokensK: 458 },
  { day: "Wed", runs: 84, vmHours: 63, tokensK: 496 },
  { day: "Thu", runs: 79, vmHours: 58, tokensK: 474 },
  { day: "Fri", runs: 91, vmHours: 68, tokensK: 535 },
  { day: "Sat", runs: 73, vmHours: 49, tokensK: 392 },
  { day: "Sun", runs: 66, vmHours: 45, tokensK: 361 },
];

const agentPerformance = [
  { agent: "Openclaw", successRate: 97, avgSeconds: 28 },
  { agent: "ShellPilot", successRate: 94, avgSeconds: 36 },
  { agent: "InfraBot", successRate: 91, avgSeconds: 44 },
  { agent: "SecureGuard", successRate: 95, avgSeconds: 32 },
  { agent: "Custom API", successRate: 89, avgSeconds: 52 },
];

const regionDistribution = [
  { region: "East US", value: 38, fill: "#2563eb" },
  { region: "West US 2", value: 28, fill: "#7c3aed" },
  { region: "Central US", value: 18, fill: "#14b8a6" },
  { region: "EU", value: 10, fill: "#f97316" },
  { region: "APAC", value: 6, fill: "#ec4899" },
];

const monthlyCost = [
  { bucket: "Compute", cost: 1840 },
  { bucket: "Storage", cost: 410 },
  { bucket: "Network", cost: 260 },
  { bucket: "Inference", cost: 1215 },
];

const chartConfig = {
  runs: { label: "Agent Runs", color: "#2563eb" },
  vmHours: { label: "VM Hours", color: "#7c3aed" },
  tokensK: { label: "Tokens (K)", color: "#14b8a6" },
  successRate: { label: "Success Rate", color: "#22c55e" },
  avgSeconds: { label: "Avg Time (s)", color: "#f97316" },
  cost: { label: "Cost (USD)", color: "#0ea5e9" },
} as const;

export function AiVmAnalyticsDashboard() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Agent Runs (7d)",
            value: "533",
            detail: "+12.4% vs previous week",
          },
          {
            label: "VM Runtime Hours",
            value: "391h",
            detail: "Across isolated compute sessions",
          },
          {
            label: "Execution Success",
            value: "93.8%",
            detail: "Stable completion across all agents",
          },
          {
            label: "Estimated Cost",
            value: "$3,725",
            detail: "Current month blended spend",
          },
        ].map((item) => (
          <Card key={item.label} className="dashboard-card landing-hover-box">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55">
                {item.label}
              </p>
              <CardTitle className="font-heading text-3xl">
                {item.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/65">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="dashboard-card landing-hover-box">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              Runtime Throughput
            </CardTitle>
            <p className="text-sm text-foreground/65">
              Agent run volume and VM hour usage over the last week.
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={runtimeTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="var(--color-runs)"
                  fill="var(--color-runs)"
                  fillOpacity={0.24}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="vmHours"
                  stroke="var(--color-vmHours)"
                  fill="var(--color-vmHours)"
                  fillOpacity={0.16}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="dashboard-card landing-hover-box">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              Agent Quality & Speed
            </CardTitle>
            <p className="text-sm text-foreground/65">
              Completion reliability and average task duration per agent.
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="agent" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="successRate" fill="var(--color-successRate)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="dashboard-card landing-hover-box">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              Token Consumption
            </CardTitle>
            <p className="text-sm text-foreground/65">
              LLM token usage trend correlated with daily runtime load.
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart data={runtimeTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="tokensK"
                  stroke="var(--color-tokensK)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="dashboard-card landing-hover-box">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              VM Region Split
            </CardTitle>
            <p className="text-sm text-foreground/65">
              Active runtime capacity by deployment region.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <PieChart>
                <Pie
                  data={regionDistribution}
                  dataKey="value"
                  nameKey="region"
                  innerRadius={46}
                  outerRadius={82}
                  paddingAngle={2}
                >
                  {regionDistribution.map((entry) => (
                    <Cell key={entry.region} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="region" />}
                />
              </PieChart>
            </ChartContainer>

            <ul className="grid gap-1.5 text-sm text-foreground/70">
              {regionDistribution.map((item) => (
                <li
                  key={item.region}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.region}
                  </span>
                  <span className="font-mono text-xs">{item.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="dashboard-card landing-hover-box">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            Monthly Cost Breakdown
          </CardTitle>
          <p className="text-sm text-foreground/65">
            Spend allocation across compute infrastructure and AI runtime
            layers.
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={monthlyCost}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="cost"
                fill="var(--color-cost)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
