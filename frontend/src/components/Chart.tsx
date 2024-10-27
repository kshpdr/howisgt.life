"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import axios from "axios";
import { useEffect, useState } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartConfig = {
  moodScore: {
    label: "Mood Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type Post = {
  created_utc: string;
  anthropic_mood_score: number;
  base_mood_score: number;
};

export function Chart({ moodScoreType }: { moodScoreType: 'anthropic' | 'base' }) {
  const [chartData, setChartData] = useState<{ date: string; moodScore: number }[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(`${import.meta.env.VITE_BACKEND_URL}/posts`);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
          params: {
            start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
          }
        });

        console.log(response);

        const posts = response.data;

        const groupedData = posts.reduce((acc: any, post: Post) => {
          const date = new Date(post.created_utc).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          if (!acc[date]) {
            acc[date] = { totalScore: 0, count: 0 };
          }
          const moodScore = moodScoreType === 'anthropic' ? post.anthropic_mood_score : post.base_mood_score;
          acc[date].totalScore += moodScore;
          acc[date].count += 1;
          return acc;
        }, {});

        const formattedData = Object.keys(groupedData).map(date => ({
          date,
          moodScore: groupedData[date].count > 0 ? groupedData[date].totalScore / groupedData[date].count : 0
        }));

        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [moodScoreType]);

  console.log(chartData)
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
            })
          }
          }
        />
        <YAxis
          dataKey="moodScore"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 20 }}
          domain={[-100, 100]} // Set the domain to cover the full range
          ticks={[-100, -50, 0, 50, 100]} // Specify the constant ticks
          tickFormatter={(value) => {
            switch (value) {
              case -100:
                return "😡";
              case -50:
                return "😕";
              case 0:
                return "😶";
              case 50:
                return "😊";
              case 100:
                return "🤑";
              default:
                return value;
            }
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey="moodScore"
          type="natural"
          stroke="#B3A369"
          strokeWidth={4}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
