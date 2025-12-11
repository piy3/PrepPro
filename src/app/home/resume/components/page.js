"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ModeToggle } from "@/components/ModeToggle";
import {
  FileText,
  Upload,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  History,
  Download,
  Eye,
  Loader2,
  Star,
} from "lucide-react";
import ResumeUpload from "./ResumeUpload";
import AnalysisResults from "./AnalysisResults";
import ResumeHistory from "./ResumeHistory";
import ImprovementSuggestions from "./ImprovementSuggestions";

const Resume = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeHistory, setResumeHistory] = useState([]);
  const [statsData, setStatsData] = useState({
    totalUploads: 0,
    avgScore: 0,
    totalImprovements: 0,
    bestScore: 0,
  });

  // Load resume history on component mount
  useEffect(() => {
    loadResumeHistory();
  }, []);

  // Update stats whenever history or current analysis changes
  useEffect(() => {
    updateStats();
  }, [resumeHistory, analysisResults]);

  const updateStats = () => {
    const allAnalyses = [...resumeHistory];
    
    // Add current analysis to stats if it exists
    if (analysisResults) {
      allAnalyses.push({
        atsScore: analysisResults.atsScore,
        suggestions: analysisResults.improvements?.length || 0,
      });
    }

    // Get total uploads from localStorage (this includes all uploads, even deleted ones)
    const totalUploadsFromStorage = parseInt(localStorage.getItem("totalUploadsCounter") || "0");

    if (allAnalyses.length === 0) {
      setStatsData({
        totalUploads: totalUploadsFromStorage,
        avgScore: 0,
        totalImprovements: 0,
        bestScore: 0,
      });
      return;
    }

    const avgScore = Math.round(
      allAnalyses.reduce((acc, item) => acc + item.atsScore, 0) / allAnalyses.length
    );

    const totalImprovements = allAnalyses.reduce(
      (acc, item) => acc + (item.suggestions || 0),
      0
    );

    const bestScore = Math.max(...allAnalyses.map((item) => item.atsScore));

    setStatsData({
      totalUploads: totalUploadsFromStorage, // Use persistent counter from localStorage
      avgScore,
      totalImprovements,
      bestScore,
    });
  };

  const loadResumeHistory = async () => {
    try {
      // Load from localStorage for now (can be replaced with API call)
      const savedHistory = localStorage.getItem("resumeHistory");
      if (savedHistory) {
        setResumeHistory(JSON.parse(savedHistory));
      }
      
      // Load upload counter from localStorage
      const uploadCounter = localStorage.getItem("totalUploadsCounter");
      if (uploadCounter) {
        console.log("Loaded upload counter from localStorage:", uploadCounter);
      }
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/resume/history');
      // const data = await response.json();
      // setResumeHistory(data.history);
    } catch (error) {
      console.error("Error loading resume history:", error);
      setResumeHistory([]);
    }
  };

  const saveToHistory = (analysis, fileName) => {
    const newEntry = {
      id: Date.now(),
      fileName: fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      atsScore: analysis.atsScore,
      status: "analyzed",
      suggestions: analysis.improvements?.length || 0,
      analysis: analysis, // Store full analysis for later viewing
    };

    const updatedHistory = [newEntry, ...resumeHistory].slice(0, 10); // Keep last 10
    setResumeHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    // TODO: Save to backend when API is ready
    // await fetch('/api/resume/history', {
    //   method: 'POST',
    //   body: JSON.stringify(newEntry),
    // });
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setLoading(true);

    try {
      console.log("Starting resume analysis for:", file.name);
      
      // Increment upload counter in localStorage
      const currentCounter = parseInt(localStorage.getItem("totalUploadsCounter") || "0");
      const newCounter = currentCounter + 1;
      localStorage.setItem("totalUploadsCounter", newCounter.toString());
      console.log("Upload counter incremented to:", newCounter);
      
      // Send file directly to backend for extraction and analysis
      const analysis = await analyzeResume(null, file);
      
      console.log("Analysis completed successfully:", {
        atsScore: analysis.atsScore,
        overallRating: analysis.overallRating,
        keywordsFound: analysis.keywordAnalysis.found.length,
        improvementsCount: analysis.improvements.length
      });
      
      setAnalysisResults(analysis);

      // Save to history
      saveToHistory(analysis, file.name);

      // Switch to results tab
      setActiveTab("results");
    } catch (error) {
      console.error("Error processing resume:", error);
      alert(error.message || "Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async (text, file) => {
    // Send to backend API for analysis
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const result = await response.json();
      
      if (!result.success || !result.data.analysis) {
        throw new Error("Invalid response from analysis API");
      }

      const analysis = result.data.analysis;
      
      console.log("Resume Analysis Results:", analysis);

      // Transform the analysis data to match the expected format
      return {
        atsScore: analysis.atsScore,
        overallRating: analysis.overallRating,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        keywordAnalysis: {
          found: analysis.keywordAnalysis.found,
          missing: analysis.keywordAnalysis.missing,
        },
        sections: analysis.sections,
        contactInfo: analysis.contactInfo,
        detailedAnalysis: analysis.detailedAnalysis,
        atsTips: analysis.atsTips,
        wordCount: analysis.wordCount,
        fileName: analysis.fileName,
      };
    } catch (error) {
      console.error("Error analyzing resume:", error);
      throw new Error(error.message || "Failed to analyze resume");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-black">
      {/* Header */}
      <div className="bg-white/50 dark:bg-black/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Resume Analyzer
                </h1>
                <p className="text-muted-foreground">
                  Get ATS optimization and improvement suggestions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Total Uploads
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {statsData.totalUploads}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Avg ATS Score
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {statsData.avgScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Improvements
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {statsData.totalImprovements}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Best Score
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {statsData.bestScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Resume
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!analysisResults}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Analysis Results
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <ResumeUpload
              onFileUpload={handleFileUpload}
              loading={loading}
              uploadedFile={uploadedFile}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {analysisResults && (
              <>
                <AnalysisResults results={analysisResults} />
                <ImprovementSuggestions
                  improvements={analysisResults.improvements}
                  keywordAnalysis={analysisResults.keywordAnalysis}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <ResumeHistory
              history={resumeHistory}
              onResumeSelect={(resume) => {
                // Load selected resume analysis
                if (resume.analysis) {
                  setAnalysisResults(resume.analysis);
                  setActiveTab("results");
                }
              }}
              onDelete={(id) => {
                // Remove from history
                const updatedHistory = resumeHistory.filter(item => item.id !== id);
                setResumeHistory(updatedHistory);
                localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resume;
