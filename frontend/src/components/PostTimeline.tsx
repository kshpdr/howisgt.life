import { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "@/components/ui/timeline";
import { PostCard } from "@/components/PostCard";

interface Post {
  post_id: string;
  author: string;
  created_utc: string;
  num_comments: number;
  base_mood_score: number;
  anthropic_mood_score: number;
  selftext: string;
  title: string;
  subreddit: string;
  post_type: string;
  url: string;
  permalink: string;
  anthropic_sentiment: number;
  flair: string;
}

export function PostTimeline({ moodScoreType }: { moodScoreType: 'anthropic' | 'base' | 'logistic_regression' | 'bert'}) {

  const [data, setData] = useState<{ date: string; posts: Post[] }[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // console.log(`${import.meta.env.VITE_BACKEND_URL}/posts`);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
          params: {
            start_date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
            end_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
            limit: 50
          }
        });

        const calculateWeightedSentiment = (sentiment: number, score: number, numComments: number) => {
          const neutralWeight = 0;
          const sentimentWeight = sentiment || neutralWeight;
          const engagementFactor = (Math.sqrt(score + 1) + Math.sqrt(numComments + 1)) / 2; // Use square root for moderation
          return sentimentWeight * engagementFactor;
        };

        const posts = response.data.map((post: Post) => {
          const moodScoreKey = `${moodScoreType}_mood_score`;
          const moodScore = post[moodScoreKey];

          const weightedSentiment = calculateWeightedSentiment(post.anthropic_sentiment, moodScore, post.num_comments);
          const clampedScore = Math.max(-1, Math.min(1, weightedSentiment / 10)); // Clamp to [-1, 1] and scale
          const normalizedScore = clampedScore * 100; // Scale to [-100, 100]
          return {
            ...post,
            moodScore: normalizedScore
          };
        });

        console.log("Fetched posts with mood scores:", posts);

        // Group posts by date
        const groupedData = posts.reduce((acc: any, post: Post) => {
          const date = new Date(post.created_utc).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(post);
          return acc;
        }, {});

        // Convert grouped data to array format
        const formattedData = Object.keys(groupedData).map(date => ({
          date,
          posts: groupedData[date]
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [moodScoreType]);


  return (
    <div className="w-full">
      <Timeline data={data.map((entry) => ({
        title: entry.date,
        content: (
          <div className="space-y-4">
            {entry.posts.map((post) => (
              <PostCard
                key={post.post_id}
                title={post.title}
                previewText={post.selftext || "No content available"}
                moodScore={moodScoreType === 'anthropic' ? post.anthropic_mood_score : post.base_mood_score}
                postUrl={"https://reddit.com" + post.permalink}
                flair={post.flair}
              />
            ))}
          </div>
        )
      }))} />
    </div>
  );
}