import './App.css'
import { Chart } from './components/Chart'
import { Button } from '@/components/ui/button'
import { FlipWords } from "@/components/ui/flip-words";
import { PostTimeline } from '@/components/PostTimeline';

function App() {
  const words = ["Fun!", "Sad :(", "Indifferent...", "Excited!", "Busy :/"];

  // Mock data for posts
  const posts = [
    {
      title: "Exploring the Campus",
      previewText: "I had a great time exploring the campus today. The weather was perfect and I met some amazing people.",
      moodScore: 8,
      postUrl: "https://reddit.com/r/georgiatech/post1"
    },
    {
      title: "Midterms Stress",
      previewText: "Midterms are coming up and the stress is real. Need to find a good study group.",
      moodScore: 4,
      postUrl: "https://reddit.com/r/georgiatech/post2"
    },
    {
      title: "Tech Fair Highlights",
      previewText: "The tech fair was incredible! So many innovative projects and companies.",
      moodScore: 9,
      postUrl: "https://reddit.com/r/georgiatech/post3"
    }
  ];

  return (
    <div className="hidden h-full flex-col md:flex space-y-8">
      <div className="sticky top-0 container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white z-10">
        <a href="/" className="text-2xl font-bold flex items-center text-black no-underline hover:text-gray-700">
          <span className="mr-2">🥵</span> howisgt.life
        </a>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <Button variant="outline">Source code</Button>
        </div>
      </div>
      <div className="flex justify-center items-center px-4">
        <div className="text-3xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
          How is <span className="font-bold">Georgia Tech</span> life?
          <FlipWords words={words} /> <br />
        </div>
      </div>
      <Chart />
      <PostTimeline />
      {/* <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            title={post.title}
            previewText={post.previewText}
            moodScore={post.moodScore}
            postUrl={post.postUrl}
          />
        ))}
      </div> */}
    </div>
  )
}

export default App