"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
  { date: "2023-10-01", moodScore: 45 },
  { date: "2023-10-02", moodScore: 67 },
  { date: "2023-10-03", moodScore: -23 },
  { date: "2023-10-04", moodScore: -45 },
  { date: "2023-10-05", moodScore: -78 },
  { date: "2023-10-06", moodScore: -90 },
  { date: "2023-10-07", moodScore: -34 },
  { date: "2023-10-08", moodScore: 12 },
  { date: "2023-10-09", moodScore: 56 },
  { date: "2023-10-10", moodScore: 89 },
  { date: "2023-10-11", moodScore: 95 },
  { date: "2023-10-12", moodScore: 78 },
  { date: "2023-10-13", moodScore: 34 },
  { date: "2023-10-14", moodScore: -12 },
  { date: "2023-10-15", moodScore: -45 },
  { date: "2023-10-16", moodScore: -67 },
  { date: "2023-10-17", moodScore: -89 },
  { date: "2023-10-18", moodScore: -95 },
  { date: "2023-10-19", moodScore: -56 },
  { date: "2023-10-20", moodScore: -23 },
  { date: "2023-10-21", moodScore: 45 },
  { date: "2023-10-22", moodScore: 78 },
  { date: "2023-10-23", moodScore: 90 },
  { date: "2023-10-24", moodScore: 67 },
  { date: "2023-10-25", moodScore: 23 },
  { date: "2023-10-26", moodScore: -12 },
  { date: "2023-10-27", moodScore: -56 },
  { date: "2023-10-28", moodScore: -78 },
  { date: "2023-10-29", moodScore: -45 },
  { date: "2023-10-30", moodScore: 12 },
  { date: "2023-10-31", moodScore: 56 },
]

const chartConfig = {
  moodScore: {
    label: "Mood Score",
    color:  "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[500px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          }
        />
        <YAxis 
          dataKey="moodScore"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="moodScore"
          type="natural"
          stroke="var(--color-moodScore)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
