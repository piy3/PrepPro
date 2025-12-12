"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuizCard from "./Components/QuizCard";
import { CreateQuizForm } from "./Components/CreateQuizForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { generateQuiz, getQuizzes } from "@/api/requests.js";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();

  const [quizzes, setQuizzes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [cursor, setCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;
  const fetchedRef = useRef(false);
  const observerTarget = useRef(null);

  // Filter quizzes based on search term and active tab
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      quiz.difficulty.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const getAllQuizzes = async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const res = await getQuizzes(cursor, limit);
      setQuizzes((prev) => [...prev, ...res.data.data]);
      setCursor(res.data.nextCursor);

      // Check if there are more quizzes to load
      if (!res.data.nextCursor || res.data.data.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsFetchingMore(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getAllQuizzes();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          getAllQuizzes();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetchingMore, cursor]);

  const handleCreateQuiz = (quizData) => {
    const newQuiz = {
      topic: quizData.topic,
      role: quizData.role,
      // participants: 0,
      // duration: quizData.duration,
      difficulty: quizData.difficulty,
      // topic: quizData.topic,
      description: quizData.description,
      numberOfQuestions: quizData.numberOfQuestions,
    };

    // setQuizzes(prev => [newQuiz, ...prev]);
    const res = generateQuiz(newQuiz);

    setIsCreateModalOpen(false);
  };

  const handleStartQuiz = (quiz) => {
    // Navigate to quiz taking page
    console.log("Starting quiz:", quiz.id);
    router.push(`/home/quizz/${quiz.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            Technical Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Test your knowledge and prepare for interviews
          </p>
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

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="easy">Easy</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="hard">Hard</TabsTrigger>
          <TabsTrigger value="hardest">Hardest</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredQuizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No quizzes found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm
              ? "Try a different search term"
              : "Create a new quiz to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={handleStartQuiz} />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger element */}
      {!searchTerm && activeTab === "all" && hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isFetchingMore && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          )}
        </div>
      )}

      {!searchTerm &&
        activeTab === "all" &&
        !hasMore &&
        filteredQuizzes.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No more quizzes to load</p>
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
