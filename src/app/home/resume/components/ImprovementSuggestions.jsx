"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Download,
  Copy,
  Star,
} from "lucide-react";

const ImprovementSuggestions = ({ improvements, keywordAnalysis }) => {
  const priorityLevels = {
    high: {
      color:
        "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
      icon: "🔥",
    },
    medium: {
      color:
        "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
      icon: "⚡",
    },
    low: {
      color:
        "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
      icon: "💡",
    },
  };

  // Assign priority to improvements (mock logic)
  const categorizedImprovements = improvements.map((improvement, index) => ({
    text: improvement,
    priority: index < 2 ? "high" : index < 4 ? "medium" : "low",
    category: index < 2 ? "Critical" : index < 4 ? "Important" : "Optional",
  }));

  const handleCopyKeywords = () => {
    const keywords = keywordAnalysis.missing.join(", ");
    navigator.clipboard.writeText(keywords);
    // You could add a toast notification here
  };

  const handleDownloadReport = () => {
    // Generate and download improvement report
    const report = `
Resume Improvement Report
========================

Improvement Suggestions:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join("\n")}

Missing Keywords:
${keywordAnalysis.missing.join(", ")}

Found Keywords:
${keywordAnalysis.found.join(", ")}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-improvement-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleDownloadReport}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline" onClick={handleCopyKeywords}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Missing Keywords
        </Button>
      </div>

      {/* Improvement Suggestions */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span>Improvement Suggestions</span>
          </CardTitle>
          <CardDescription>
            Actionable recommendations to enhance your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorizedImprovements.map((improvement, index) => (
              <Card
                key={index}
                className={`${
                  priorityLevels[improvement.priority].color
                } transition-all hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">
                      {priorityLevels[improvement.priority].icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {improvement.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {improvement.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {improvement.text}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Wins</span>
            </CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-300">
              Easy improvements for immediate impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Add missing keywords to skills section
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Quantify achievements with numbers
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Update contact information</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">
                <ArrowRight className="h-4 w-4 mr-2" />
                Start Improvements
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
              <Star className="h-5 w-5" />
              <span>Pro Tips</span>
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Expert advice for better results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  Use action verbs to start bullet points
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  Tailor keywords to job descriptions
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">
                  Keep format consistent throughout
                </span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">
                <ArrowRight className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Recommendations */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Keyword Recommendations</CardTitle>
          <CardDescription>
            Add these industry-relevant keywords to improve ATS compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">High Priority Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywordAnalysis.missing.slice(0, 3).map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/30"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Additional Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywordAnalysis.missing.slice(3).map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovementSuggestions;
