"use client";

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
  TrendingUp,
  Star,
  CheckCircle,
  AlertTriangle,
  FileText,
  Target,
  Award,
  BarChart3,
  Lightbulb,
  Info,
} from "lucide-react";

const AnalysisResults = ({ results }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80)
      return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
    if (score >= 60)
      return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* ATS Tips Banner - Show first if available */}
      {results.atsTips && results.atsTips.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <Lightbulb className="h-5 w-5" />
              <span>ATS Optimization Tips</span>
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Recommendations based on your ATS score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.atsTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className={`${getScoreBgColor(results.atsScore)} backdrop-blur-sm`}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Target className="h-6 w-6" />
              <span>ATS Score</span>
            </CardTitle>
            <CardDescription>
              Applicant Tracking System Compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div
              className={`text-4xl font-bold ${getScoreColor(
                results.atsScore
              )} mb-4`}
            >
              {results.atsScore}/100
            </div>
            <Progress value={results.atsScore} className="w-full mb-4" />
            <Badge
              variant={
                results.atsScore >= 80
                  ? "default"
                  : results.atsScore >= 60
                  ? "secondary"
                  : "destructive"
              }
            >
              {results.atsScore >= 80
                ? "Excellent"
                : results.atsScore >= 60
                ? "Good"
                : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Overall Rating</span>
            </CardTitle>
            <CardDescription>Professional Resume Quality</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {results.overallRating}/5.0
            </div>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {getRatingStars(results.overallRating)}
            </div>
            <Badge variant="outline">
              {results.overallRating >= 4
                ? "Outstanding"
                : results.overallRating >= 3
                ? "Good"
                : "Average"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Section Analysis */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Section Analysis</span>
          </CardTitle>
          <CardDescription>
            Detailed breakdown of each resume section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(results.sections).map(([section, data]) => (
              <div key={section} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">
                      {section.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <Badge
                      variant="outline"
                      className={getScoreColor(data.score)}
                    >
                      {data.score}/100
                    </Badge>
                  </div>
                  <span className={`text-sm ${getScoreColor(data.score)}`}>
                    {data.score >= 80
                      ? "Excellent"
                      : data.score >= 60
                      ? "Good"
                      : "Needs Work"}
                  </span>
                </div>
                <Progress value={data.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{data.feedback}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Strengths</span>
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-300">
            What your resume does well
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  {strength}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyword Analysis */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Keyword Analysis</span>
          </CardTitle>
          <CardDescription>
            Industry-relevant keywords found and missing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Found Keywords ({results.keywordAnalysis.found.length})
              </h4>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {results.keywordAnalysis.found.slice(0, 20).map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    {keyword}
                  </Badge>
                ))}
                {results.keywordAnalysis.found.length > 20 && (
                  <Badge variant="secondary" className="text-xs">
                    +{results.keywordAnalysis.found.length - 20} more
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Missing Keywords ({results.keywordAnalysis.missing.length})
              </h4>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {results.keywordAnalysis.missing.slice(0, 20).map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                  >
                    {keyword}
                  </Badge>
                ))}
                {results.keywordAnalysis.missing.length > 20 && (
                  <Badge variant="secondary" className="text-xs">
                    +{results.keywordAnalysis.missing.length - 20} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      {results.wordCount && (
        <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Resume Statistics</span>
            </CardTitle>
            <CardDescription>
              Key metrics about your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.wordCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total Words
                </div>
              </div>
              {results.detailedAnalysis?.bulletPointCount && (
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.detailedAnalysis.bulletPointCount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Bullet Points
                  </div>
                </div>
              )}
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.keywordAnalysis.found.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Keywords Found
                </div>
              </div>
              {results.detailedAnalysis?.readabilityScore && (
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {results.detailedAnalysis.readabilityScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Readability Score
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;
