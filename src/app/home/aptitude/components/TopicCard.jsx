"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "Mixed":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const TopicCard = ({ topic, isHovered, onHover, onLeave, onClick }) => {
  const IconComponent = topic.icon;

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden ${
        isHovered ? "ring-2 ring-blue-500" : ""
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div
            className={`p-3 rounded-lg ${topic.color} ${
              topic.color.includes("gradient") ? "" : "bg-opacity-10"
            }`}
          >
            <IconComponent
              className={`h-6 w-6 ${
                topic.color.includes("gradient") ? "text-white" : "text-current"
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:shadow-lg transition-all duration-300"
          size="sm"
        >
          Start Practice
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
