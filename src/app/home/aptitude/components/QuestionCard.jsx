"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Circle, Lightbulb } from "lucide-react";

const QuestionCard = ({
  question,
  selectedOption,
  showAnswer,
  isCorrect,
  showExplanation,
  onOptionSelect,
  onToggleExplanation,
}) => {
  if (!question) return null;

  return (
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
              cardStyle += " ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20";
              iconColor = "text-red-600";
              IconComponent = XCircle;
            }
          } else if (selectedOption === index) {
            cardStyle += " ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20";
            iconColor = "text-blue-600";
            IconComponent = CheckCircle;
          } else {
            cardStyle += " hover:bg-gray-50 dark:hover:bg-gray-800/50";
          }

          return (
            <Card
              key={index}
              className={cardStyle}
              onClick={() => onOptionSelect(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <IconComponent
                    className={`h-5 w-5 ${iconColor} flex-shrink-0`}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    <span className="text-sm leading-relaxed">{option}</span>
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
                  onClick={onToggleExplanation}
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
    </>
  );
};

export default QuestionCard;
