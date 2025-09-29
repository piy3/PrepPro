"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  TrendingUp,
  Droplets,
  Clock,
  Shuffle,
  Car,
  DollarSign,
  Calendar,
  Zap,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";

const aptitudeTopics = [
    {
    name: "Random",
    apiName: "random",
    description: "Mixed questions from all topics",
    icon: Zap,
    color: "bg-gradient-to-r from-pink-500 to-violet-500",
    difficulty: "Mixed",
    questions: "∞",
  },
  {
    name: "Mixture and Alligation",
    apiName: "MixtureAndAlligation",
    description: "Master problems involving mixing solutions and alligation",
    icon: Droplets,
    color: "bg-blue-500",
    difficulty: "Medium",
    questions: "50+",
  },
  {
    name: "Profit and Loss",
    apiName: "ProfitAndLoss",
    description: "Calculate profit, loss, and percentage problems",
    icon: TrendingUp,
    color: "bg-green-500",
    difficulty: "Easy",
    questions: "75+",
  },
  {
    name: "PipesAndCistern",
    apiName: "PipesAndCistern",
    description: "Solve time, work, and efficiency problems",
    icon: Droplets,
    color: "bg-cyan-500",
    difficulty: "Medium",
    questions: "60+",
  },
  {
    name: "Age",
    apiName: "age",
    description: "Calculate age-related mathematical problems",
    icon: Clock,
    color: "bg-purple-500",
    difficulty: "Easy",
    questions: "40+",
  },
  {
    name: "Permutation and Combination",
    apiName: "PermutationAndCombination",
    description: "Master arrangements and selections",
    icon: Shuffle,
    color: "bg-orange-500",
    difficulty: "Hard",
    questions: "65+",
  },
  {
    name: "Speed Time Distance",
    apiName: "SpeedTimeDistance",
    description: "Solve motion and distance problems",
    icon: Car,
    color: "bg-red-500",
    difficulty: "Medium",
    questions: "80+",
  },
  {
    name: "Simple Interest",
    apiName: "SimpleInterest",
    description: "Calculate interest and financial problems",
    icon: DollarSign,
    color: "bg-emerald-500",
    difficulty: "Easy",
    questions: "45+",
  },
  {
    name: "Calendars",
    apiName: "Calendar",
    description: "Date, day, and calendar calculations",
    icon: Calendar,
    color: "bg-indigo-500",
    difficulty: "Medium",
    questions: "35+",
  }
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-black/60 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-black/60 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-black/60 dark:text-red-400";
    case "Mixed":
      return "bg-purple-100 text-purple-800 dark:bg-black/60 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-black/60 dark:text-gray-400";
  }
};

const Aptitude = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleTopicClick = (topic) => {
    router.push(`/home/aptitude/${topic.apiName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-black">
      {/* Header Section */}
      <div className="bg-white/50 dark:bg-black/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Aptitude Practice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master quantitative aptitude with our comprehensive practice
              modules. Choose from various topics and challenge yourself with
              unlimited questions.
            </p>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Choose Your Topic</h2>
          <p className="text-muted-foreground">
            Select a topic to start practicing aptitude questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aptitudeTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden ${
                  hoveredCard === index ? "ring-2 ring-blue-500" : ""
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleTopicClick(topic)}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 dark:to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${topic.color} ${
                        topic.color.includes("gradient") ? "" : "bg-opacity-10"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${
                          topic.color.includes("gradient")
                            ? "text-white"
                            : "text-current"
                        }`}
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className={getDifficultyColor(topic.difficulty)}
                    >
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {topic.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{topic.questions}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300"
                    size="sm"
                  >
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-white/50 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">Practice Statistics</h3>
            <p className="text-muted-foreground">
              Track your progress across different topics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-black/60 rounded-xl">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                500+
              </div>
              <div className="text-sm text-muted-foreground">
                Total Questions
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-black/60 rounded-xl">
              <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                9
              </div>
              <div className="text-sm text-muted-foreground">
                Topics Available
              </div>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-black/60 rounded-xl">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ∞
              </div>
              <div className="text-sm text-muted-foreground">
                Practice Sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aptitude;
