'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import QuizCard from './Components/QuizCard';
import { CreateQuizForm } from './Components/CreateQuizForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { generateQuiz, getQuizzes } from '@/api/requests.js'

// Mock data - replace with actual API calls
const MOCK_QUIZZES = [
  {
    id: '1',
    topic: 'React Fundamentals',
    role: 'Frontend Developer',
    participants: 124,
    duration: 15,
    difficulty: 'Medium',
    topic: 'React',
    description: 'Test your React knowledge with these fundamental questions.'
  },
  {
    id: '2',
    topic: 'System Design Principles',
    role: 'SDE 2',
    participants: 89,
    duration: 30,
    difficulty: 'Hard',
    topic: 'System Design',
    description: 'Advanced system design concepts for senior engineers.'
  },
  {
    id: '3',
    topic: 'JavaScript Basics',
    role: 'SDE 1',
    participants: 256,
    duration: 20,
    difficulty: 'Easy',
    topic: 'JavaScript',
    description: 'Basic JavaScript concepts for beginners.'
  },
];

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const limit = 10;
  const fetchedRef = useRef(false);

  // Filter quizzes based on search term and active tab
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || quiz.difficulty.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const getAllQuizzes = async () => {
    // setIsLoading(true) is optional; keeping UI stable during dev double-invoke
    const res = await getQuizzes(cursor, limit);
    // console.log("RESS:", { ...quizzes, ...res.data.data })
    // setQuizzes({ ...quizzes, ...res.data.data });
    setQuizzes(prev => [...prev,...res.data.data]);
    setCursor(res.data.nextCursor);
    setIsLoading(false);
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getAllQuizzes();
  },[]);

  const handleCreateQuiz = (quizData) => {
    const newQuiz = {
      topic: quizData.topic,
      role: quizData.role,
      // participants: 0,
      // duration: quizData.duration,
      difficulty: quizData.difficulty,
      // topic: quizData.topic,
      description: quizData.description,
      numberOfQuestions:quizData.numberOfQuestions
    };

    // setQuizzes(prev => [newQuiz, ...prev]);
    const res = generateQuiz(newQuiz);

    setIsCreateModalOpen(false);
  };

  const handleStartQuiz = (quiz) => {
    // Navigate to quiz taking page
    console.log('Starting quiz:', quiz.id);
    // router.push(`/quiz/${quiz.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Technical Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge and prepare for interviews</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="easy">Easy</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="hard">Hard</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No quizzes found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? 'Try a different search term' : 'Create a new quiz to get started'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onStartQuiz={handleStartQuiz}
            />
          ))}
        </div>
      )}

      <CreateQuizForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuiz}
      />
    </div>
  );
}