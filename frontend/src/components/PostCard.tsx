import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostCardProps {
  title: string;
  previewText: string;
  moodScore: number;
  postUrl: string;
}

export function PostCard({ title, previewText, moodScore, postUrl }: PostCardProps) {
  // Calculate the color based on the mood score
  const moodColor = moodScore < 0
  ? `hsl(${(moodScore + 100) * 0.6}, 70%, 50%)` // Red to Grey
  : `hsl(${(moodScore * 0.6) + 60}, 70%, 50%)`; // Grey to Green
  return (
    <Card
      className="w-[350px] cursor-pointer hover:shadow-lg transition-shadow p-4"
      onClick={() => window.open(postUrl, "_blank")}
      style={{ borderColor: moodColor, borderWidth: '2px', borderStyle: 'solid' }}
    >
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-xs" style={{ color: moodColor }}>Mood Score: {moodScore}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{previewText}</p>
      </CardContent>
    </Card>
  );
}