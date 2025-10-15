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
  History,
  FileText,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ResumeHistory = ({ history, onResumeSelect }) => {
  const getScoreColor = (score) => {
    if (score >= 80)
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20";
    if (score >= 60)
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (resume) => {
    // Mock download functionality
    console.log("Downloading resume:", resume.fileName);
  };

  const handleDelete = (resumeId) => {
    // Mock delete functionality
    console.log("Deleting resume:", resumeId);
  };

  const handleView = (resume) => {
    onResumeSelect(resume);
  };

  if (history.length === 0) {
    return (
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No Resume History
          </h3>
          <p className="text-muted-foreground mb-6">
            Upload your first resume to start building your analysis history.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              /* Navigate to upload tab */
            }}
          >
            Upload Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* History Header */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Resume Analysis History</span>
          </CardTitle>
          <CardDescription>
            View and manage your previous resume analyses ({history.length}{" "}
            total)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {history.map((resume) => (
          <Card
            key={resume.id}
            className="bg-white/50 dark:bg-black/60 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleView(resume)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {resume.fileName}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(resume.uploadDate)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {resume.suggestions} suggestions
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* ATS Score */}
                  <div
                    className={`px-3 py-2 rounded-lg ${getScoreColor(
                      resume.atsScore
                    )}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{resume.atsScore}</div>
                      <div className="text-xs">ATS Score</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge variant={getScoreBadge(resume.atsScore)}>
                    {resume.status === "analyzed" ? "Completed" : "Processing"}
                  </Badge>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(resume);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Analysis
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(resume);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* History Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-400">
            Analysis Summary
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-300">
            Your resume improvement journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {history.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Analyses
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {history.length > 0
                  ? Math.round(
                      history.reduce(
                        (acc, resume) => acc + resume.atsScore,
                        0
                      ) / history.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {history.length > 0
                  ? Math.max(...history.map((r) => r.atsScore))
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {history.reduce((acc, resume) => acc + resume.suggestions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tips</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeHistory;
