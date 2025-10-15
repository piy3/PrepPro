"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "@/api/interceptor";
import { getCurrentQuiz } from "@/api/requests";
import { useAuth } from "@/store/useAuth";

export default function QuizStartPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  // State management
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const currentUser = useAuth((state)=>state.getUserInfo());

  // Fetch quiz data
  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCurrentQuiz(id);
      setQuiz(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load quiz. Please try again.");
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !quiz) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, quizStarted, quiz]);

  // Initialize quiz
  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex ,
    }));
  };

  // Handle next question
  const handleNextQuestion = () => {
    // Set answer to -1 if no option was selected
    if (selectedAnswers[currentQuestion] === undefined) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion]: -1,
      }));
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeRemaining(60);
    } else {
      handleSubmitQuiz();
    }
  };
  

  // Submit quiz
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    // Calculate total time taken in seconds
    const quizEndTime = Date.now();
    const totalTimeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);

    try {
    const payload = {
      quizId: id,
      answers: selectedAnswers,
      timeTaken: totalTimeTaken, // Time in seconds
    };
    
      await api.post(`/api/v1/quiz/submitquiz/${id}`, payload);
      router.push(`/home/quizz/${id}/result?userId=${currentUser.user.id}`);
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
      console.error("Error submitting quiz:", err);
    } finally {
    setIsSubmitting(false);
    }
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(60);
    setQuizStartTime(Date.now()); // Record quiz start time
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Loading Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we prepare your quiz...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Error Loading Quiz</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchQuiz} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="p-4 flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PrepPro Quiz
          </h1> */}
          {/* <ModeToggle /> */}
        </header>

        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Ready to Start?</CardTitle>
              <CardDescription className="text-lg">
                {quiz?.title || "Quiz Challenge"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {quiz?.questions?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Questions
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      1 min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Per Question
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.ceil((quiz?.questions?.length || 0) / 60)} min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Time
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                    Instructions:
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Each question has a 1-minute time limit</li>
                    <li>• Select one answer per question</li>
                    <li>• You cannot go back to previous questions</li>
                    <li>• The quiz will auto-submit when complete</li>
                  </ul>
                </div>

                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQ = quiz?.questions?.[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="p-4 border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PrepPro Quiz
            </h1>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-full">
              <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span
                className={`font-mono font-bold ${
                  timeRemaining <= 10
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
                {String(timeRemaining % 60).padStart(2, "0")}
              </span>
            </div>
            {/* <ModeToggle /> */}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <main className="p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Options */}
          <div className="grid gap-4 mb-8">
            {currentQ?.options?.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAnswer === index
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {selectedAnswer === index ? (
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex items-center space-x-3 flex-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {String.fromCharCode(65 + index)}
                      </Badge>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedAnswer !== undefined ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Answer selected
                </span>
              ) : (
                <span>Select an answer to continue</span>
              )}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === undefined || isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : currentQuestion === quiz.questions.length - 1 ? (
                <>
                  Submit Quiz
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
