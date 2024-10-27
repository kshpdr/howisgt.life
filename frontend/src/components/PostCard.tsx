import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  title: string;
  previewText: string;
  moodScore: number;
  postUrl: string;
  flair: string;
}

export function PostCard({ title, previewText, moodScore, postUrl, flair }: PostCardProps) {
  const moodColor = moodScore < 0
    ? `hsl(${(moodScore + 100) * 0.6}, 70%, 50%)`
    : `hsl(${(moodScore * 0.6) + 60}, 70%, 50%)`;

  return (
    <Card
      className="w-full sm:w-[350px] cursor-pointer hover:shadow-lg transition-shadow p-3 sm:p-4 relative"
      onClick={() => window.open(postUrl, "_blank")}
      style={{ borderColor: moodColor, borderWidth: '2px', borderStyle: 'solid' }}
    >
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
        <Badge
          variant="outline"
          style={{
            color: '#333',
            padding: '0.2em 0.5em',
          }}
        >
          {flair || 'No Tag'}
        </Badge>
        <Badge
          variant="secondary"
          style={{
            color: moodColor,
            padding: '0.2em 0.5em',
            borderRadius: '0.25em'
          }}
        >
          Mood Score: {Math.round(moodScore)}
        </Badge>
      </div>
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-base sm:text-lg font-semibold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-gray-700" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3, // Number of lines to show
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {previewText}
        </p>
      </CardContent>
    </Card>
  );
}