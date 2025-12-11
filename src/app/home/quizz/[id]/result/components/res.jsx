"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getCurrentQuiz, getQuizAttemps } from "@/api/requests";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  Target,
  Users,
  CheckCircle,
  XCircle,
  Medal,
  ArrowLeft,
  RefreshCw,
  Crown,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";

export default function Result({ params, searchParams }) {
  const router = useRouter();

  // Get id from route parameters using hook
  const routeParams = useParams();
  const searchQuery = useSearchParams();

  // Extract id and userId
  const id = routeParams?.id; //quiz id
  const userId = searchQuery?.get("userId");

  console.log("Quiz Id:", id, "User Id:", userId);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch real data from API
  useEffect(() => {
    const fetchResults = async () => {
      if (!id || !userId) {
        console.log("Missing id or userId");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching quiz data for quiz:", id, "user:", userId);

        // Fetch quiz details and attempts in parallel
        const [quizResponse, attemptsResponse] = await Promise.all([
          getCurrentQuiz(id),
          getQuizAttemps(id),
        ]);

        console.log("Quiz Response:", quizResponse.data);
        console.log("Attempts Response:", attemptsResponse.data);

        const quizData = quizResponse.data;
        const attempts = attemptsResponse.data;

        // Find current user's attempt
        const userAttempt = attempts.find(
          (attempt) => attempt.userId === userId
        );

        if (!userAttempt) {
          console.error("User attempt not found");
          setLoading(false);
          return;
        }

        // Calculate user rank (attempts are sorted by score in descending order)
        const userRank =
          attempts.findIndex((attempt) => attempt.userId === userId) + 1;

        // Calculate total questions from quiz data
        const totalQuestions = quizData.questions?.length || 0;

        // Calculate percentage and score based on correct answers
        const percentage =
          totalQuestions > 0
            ? (userAttempt.correctAnswers / totalQuestions) * 100
            : 0;

        // Calculate score using correct answers / total questions * 100
        const calculatedScore =
          totalQuestions > 0
            ? (userAttempt.correctAnswers / totalQuestions) * 100
            : 0;

        // Prepare quiz result data
        const result = {
          correctAnswers: userAttempt.correctAnswers,
          totalQuestions: totalQuestions,
          timeTaken: userAttempt.timeTaken,
          userRank: userRank,
          totalParticipants: attempts.length,
          score: Math.round(calculatedScore * 100) / 100, // Round to 2 decimal places
          percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
          userName: userAttempt.user?.fullname || "Unknown User",
          quizTitle: `${quizData.topic} - ${quizData.difficulty} Level`,
        };

        // Prepare leaderboard data
        const leaderboardData = attempts.map((attempt, index) => {
          const userName = attempt.user?.fullname || "Unknown User";
          const avatar = userName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return {
            rank: index + 1,
            userName: userName,
            score: Math.round(attempt.score * 100) / 100,
            timeTaken: attempt.timeTaken,
            avatar: avatar,
            isCurrentUser: attempt.userId === userId,
            userId: attempt.userId,
          };
        });

        console.log("Processed Result:", result);
        console.log("Processed Leaderboard:", leaderboardData);

        setQuizResult(result);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching results:", error);
        // Set error state or show fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, userId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return {
        level: "Excellent",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950/20",
      };
    if (percentage >= 80)
      return {
        level: "Very Good",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
      };
    if (percentage >= 70)
      return {
        level: "Good",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      };
    if (percentage >= 60)
      return {
        level: "Average",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
      };
    return {
      level: "Needs Improvement",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    };
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return (
      <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Loading Results</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we prepare your quiz results...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case when quiz result is not loaded
  if (!quizResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Error Loading Results</h3>
                <p className="text-sm text-muted-foreground">
                  Could not load your quiz results. Please try again.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performance = getPerformanceLevel(quizResult.percentage);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Quiz Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  {quizResult.quizTitle}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Score Card */}
            <Card className={`${performance.bgColor} border-2`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Trophy className="h-16 w-16 text-primary" />
                    {quizResult.userRank <= 3 && (
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(quizResult.userRank)}
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {quizResult.score}%
                </CardTitle>
                <CardDescription
                  className={`text-lg font-medium ${performance.color}`}
                >
                  {performance.level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-medium">
                      {quizResult.correctAnswers}/{quizResult.totalQuestions}
                    </span>
                  </div>
                  <Progress value={quizResult.percentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {quizResult.correctAnswers}/{quizResult.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {formatTime(quizResult.timeTaken)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time Taken
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    #{quizResult.userRank}
                  </div>
                  <div className="text-sm text-muted-foreground">Your Rank</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {quizResult.totalParticipants}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Participants
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span>Leaderboard</span>
            </CardTitle>
            <CardDescription>
              Top performers ranked by score and completion time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((participant) => (
                <div
                  key={participant.rank}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    participant.isCurrentUser
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/50 hover:bg-muted/80"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(participant.rank)}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                        {participant.avatar}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            participant.isCurrentUser
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {participant.userName}
                          {participant.isCurrentUser && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {formatTime(participant.timeTaken)}
                    </div>
                    <div className="text-sm text-muted-foreground">Time</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/home/quizz")}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Take Another Quiz
          </Button>
          <Button variant="outline" onClick={() => router.push("/home")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
