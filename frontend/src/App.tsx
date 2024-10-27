import './App.css';
import { Chart } from './components/Chart';
import { Button } from '@/components/ui/button';
import { PostTimeline } from '@/components/PostTimeline';
import { Icons } from "@/components/Icons";
import { HeroHighlightDemo } from '@/components/HeroHighlightDemo';
import { About } from '@/components/About';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  const [moodScoreType, setMoodScoreType] = useState<'anthropic' | 'base'>('anthropic');

  return (
    <Router>
      <div className="h-full flex-col md:flex space-y-8">
        <div className="sticky top-0 container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-4">
            <Link to="/" className="text-2xl font-bold flex items-center text-black no-underline hover:text-gray-700">
              <span className="mr-2">🥵</span> howisgt.life
            </Link>
            {/* <Link to="/about" className="text-black hover:text-gray-700">
              About
            </Link> */}
          </div>
          <div className="flex flex-col sm:flex-row w-auto space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 justify-start">
            <Select onValueChange={(value) => setMoodScoreType(value as 'anthropic' | 'base')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Claude 3.5 Sonnet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Claude Sonnet 3.5</SelectItem>
                <SelectItem value="base">Base Model</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild variant="outline" className="text-black hover:text-gray-700">
              <a href="https://github.com/kshpdr/howisgt.life" target="_blank" rel="noopener noreferrer">
                Source code
                <Icons.gitHub className="h-4 w-4 mr-2" />
              </a>
            </Button>
          </div>
        </div>
        <Routes>
          <Route path="/" element={
            <>
              <HeroHighlightDemo />
              <Chart moodScoreType={moodScoreType} />
              <PostTimeline moodScoreType={moodScoreType} />
            </>
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;