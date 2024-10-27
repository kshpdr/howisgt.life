import { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "@/components/ui/timeline";
import { PostCard } from "@/components/PostCard";

interface Post {
  post_id: string;
  author: string;
  created_utc: string;
  num_comments: number;
  score: number;
  selftext: string;
  title: string;
  subreddit: string;
  post_type: string;
  url: string;
  permalink: string;
  moodScore: number;
}

export function PostTimeline() {
  // const data = [
  //   {
  //     date: "October 25, 2023",
  //     posts: [
  //       {
  //         title: "Exploring the Campus",
  //         previewText: "I had a great time exploring the campus today. The weather was perfect and I met some amazing people.",
  //         moodScore: 80,
  //         postUrl: "https://reddit.com/r/georgiatech/post1"
  //       },
  //       {
  //         title: "Midterms Stress",
  //         previewText: "Midterms are coming up and the stress is real. Need to find a good study group.",
  //         moodScore: -40,
  //         postUrl: "https://reddit.com/r/georgiatech/post2"
  //       }
  //     ]
  //   },
  //   {
  //     date: "October 24, 2023",
  //     posts: [
  //       {
  //         title: "Tech Fair Highlights",
  //         previewText: "The tech fair was incredible! So many innovative projects and companies.",
  //         moodScore: 90,
  //         postUrl: "https://reddit.com/r/georgiatech/post3"
  //       },
  //       {
  //         title: "Library Study Session",
  //         previewText: "Spent the evening at the library. It was quiet and productive.",
  //         moodScore: 70,
  //         postUrl: "https://reddit.com/r/georgiatech/post4"
  //       }
  //     ]
  //   },
  //   {
  //     date: "October 23, 2023",
  //     posts: [
  //       {
  //         title: "Football Game",
  //         previewText: "Attended the football game. The energy was amazing!",
  //         moodScore: 100,
  //         postUrl: "https://reddit.com/r/georgiatech/post5"
  //       },
  //       {
  //         title: "Group Project Meeting",
  //         previewText: "Met with my group for our project. We made good progress.",
  //         moodScore: 60,
  //         postUrl: "https://reddit.com/r/georgiatech/post6"
  //       },
  //       {
  //         title: "Rainy Day",
  //         previewText: "It rained all day, which was a bit of a downer.",
  //         moodScore: -30,
  //         postUrl: "https://reddit.com/r/georgiatech/post7"
  //       }
  //     ]
  //   },
  //   {
  //     date: "October 22, 2023",
  //     posts: [
  //       {
  //         title: "Weekend Hike",
  //         previewText: "Went hiking with friends. The views were breathtaking.",
  //         moodScore: 95,
  //         postUrl: "https://reddit.com/r/georgiatech/post8"
  //       },
  //       {
  //         title: "Cooking Class",
  //         previewText: "Took a cooking class and learned to make pasta from scratch.",
  //         moodScore: 85,
  //         postUrl: "https://reddit.com/r/georgiatech/post9"
  //       }
  //     ]
  //   },
  //   {
  //     date: "October 21, 2023",
  //     posts: [
  //       {
  //         title: "Movie Night",
  //         previewText: "Watched a movie with friends. It was a fun night.",
  //         moodScore: 75,
  //         postUrl: "https://reddit.com/r/georgiatech/post10"
  //       },
  //       {
  //         title: "Study Marathon",
  //         previewText: "Spent the day studying for exams. It was exhausting but necessary.",
  //         moodScore: -50,
  //         postUrl: "https://reddit.com/r/georgiatech/post11"
  //       }
  //     ]
  //   }
  // ];
  const [data, setData] = useState<{ date: string; posts: Post[] }[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
          params: {
            start_date: '2024-10-21',
            end_date: '2024-10-25',
            limit: 100
          }
        });

        console.log(response.data)

        const posts = response.data.map((post: Post) => ({
          ...post,
          moodScore: 0 // Temporarily override sentiment score
        }));

        console.log("Fetched posts:", posts);

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
  }, []);


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
                moodScore={post.moodScore}
                postUrl={post.url}
              />
            ))}
          </div>
        )
      }))} />
    </div>
  );
}