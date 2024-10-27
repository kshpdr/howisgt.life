import './App.css';
import { Chart } from './components/Chart';
import { Button } from '@/components/ui/button';
import { PostTimeline } from '@/components/PostTimeline';
import { Icons } from "@/components/Icons";
import { HeroHighlightDemo } from '@/components/HeroHighlightDemo';
import { About } from '@/components/About';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  return (
    <Router>
      <div className="hidden h-full flex-col md:flex space-y-8">
        <div className="sticky top-0 container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white z-10">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold flex items-center text-black no-underline hover:text-gray-700">
              <span className="mr-2">🥵</span> howisgt.life
            </Link>
            <Link to="/about" className="text-black hover:text-gray-700">
              About
            </Link>
          </div>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Claude 3.5 Sonnet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="dark">Gemini</SelectItem>
                <SelectItem value="system">Local model</SelectItem>
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
              <Chart />
              <PostTimeline />
            </>
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;