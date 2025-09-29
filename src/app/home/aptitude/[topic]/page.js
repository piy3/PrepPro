"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Home,
} from "lucide-react";

export default function AptitudeTopicPage({ params }) {
  const { topic } = use(params);
  const router = useRouter();

  // State management
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Format topic name for display
  const formatTopicName = (topicSlug) => {
    return topicSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch question from API
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedOption(null);
      setShowAnswer(false);
      setIsCorrect(null);
      setShowExplanation(false);

      const response = await fetch(`https://aptitude-api.vercel.app/${topic}`);
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      setError("Failed to load question. Please try again.");
      console.error("Error fetching question:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize first question
  useEffect(() => {
    fetchQuestion();
  }, [topic]);

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    if (showAnswer) return; // Prevent selection after answer is shown

    setSelectedOption(optionIndex);
    const selectedAnswer = question.options[optionIndex];
    const correct = selectedAnswer === question.answer;

    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    setQuestionCount((prev) => prev + 1);
    fetchQuestion();
  };

  // Handle restart
  const handleRestart = () => {
    setQuestionCount(1);
    setCorrectAnswers(0);
    fetchQuestion();
  };

  // Calculate accuracy
  const accuracy =
    questionCount > 1
      ? Math.round((correctAnswers / (questionCount - 1)) * 100)
      : 0;

  // Loading state
  if (loading && !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Loading Question</h3>
                <p className="text-sm text-muted-foreground">
                  Preparing your {formatTopicName(topic)} question...
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
                <h3 className="text-lg font-medium">Error Loading Question</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <div className="flex space-x-2">
                  <Button onClick={fetchQuestion} variant="outline">
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.push("/home/aptitude")}
                    variant="default"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/home/aptitude")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatTopicName(topic)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {questionCount}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Accuracy: {accuracy}%
              </Badge>
              <Badge variant="outline">
                {correctAnswers}/{questionCount - 1} Correct
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {questionCount}
              </div>
              <div className="text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="font-semibold text-green-600 dark:text-green-400">
                {correctAnswers}
              </div>
              <div className="text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="font-semibold text-purple-600 dark:text-purple-400">
                {accuracy}%
              </div>
              <div className="text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {question && (
          <>
            {/* Question Card */}
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">
                  {question.question}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Options */}
            <div className="grid gap-4 mb-6">
              {question.options.map((option, index) => {
                let cardStyle =
                  "cursor-pointer transition-all duration-200 hover:shadow-md";
                let iconColor = "text-gray-400";
                let IconComponent = Circle;

                if (showAnswer) {
                  if (option === question.answer) {
                    cardStyle +=
                      " ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20";
                    iconColor = "text-green-600";
                    IconComponent = CheckCircle;
                  } else if (selectedOption === index) {
                    cardStyle +=
                      " ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20";
                    iconColor = "text-red-600";
                    IconComponent = XCircle;
                  }
                } else if (selectedOption === index) {
                  cardStyle +=
                    " ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20";
                  iconColor = "text-blue-600";
                  IconComponent = CheckCircle;
                } else {
                  cardStyle += " hover:bg-gray-50 dark:hover:bg-gray-800/50";
                }

                return (
                  <Card
                    key={index}
                    className={cardStyle}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent
                          className={`h-5 w-5 ${iconColor} flex-shrink-0`}
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {String.fromCharCode(65 + index)}
                          </Badge>
                          <span className="text-sm leading-relaxed">
                            {option}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Answer Feedback */}
            {showAnswer && (
              <Card
                className={`mb-6 ${
                  isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-red-500 bg-red-50 dark:bg-red-950/20"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-medium ${
                        isCorrect
                          ? "text-green-800 dark:text-green-200"
                          : "text-red-800 dark:text-red-200"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    The correct answer is: <strong>{question.answer}</strong>
                  </p>

                  {question.explanation && (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="mb-2"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        {showExplanation ? "Hide" : "Show"} Explanation
                      </Button>

                      {showExplanation && (
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/home/aptitude")}
                  className="flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  All Topics
                </Button>
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
