'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, ArrowRight } from "lucide-react";

const QuizCard = ({ quiz, onStartQuiz }) => {
  const { topic, role, participants, duration, difficulty,description } = quiz;

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{topic}</CardTitle>
          <Badge variant="outline" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span className="font-medium">Role:</span>
          <Badge variant="secondary" className="ml-2">
            {role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration} min</span>
          </div>
        </div>
        <Button 
          onClick={() => onStartQuiz(quiz)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Start Quiz
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
