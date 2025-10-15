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
import pdf from "pdf-parse";

const Resume = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeHistory, setResumeHistory] = useState([]);

  // Load resume history on component mount
  useEffect(() => {
    loadResumeHistory();
  }, []);

  const loadResumeHistory = async () => {
    try {
      // Replace with your API call
      // const response = await api.get('/api/v1/resume/history');
      // setResumeHistory(response.data);

      // Mock data for demonstration
      setResumeHistory([
        {
          id: 1,
          fileName: "john_doe_resume.pdf",
          uploadDate: "2024-09-25",
          atsScore: 85,
          status: "analyzed",
          suggestions: 12,
        },
        {
          id: 2,
          fileName: "software_engineer_resume.pdf",
          uploadDate: "2024-09-20",
          atsScore: 72,
          status: "analyzed",
          suggestions: 18,
        },
      ]);
    } catch (error) {
      console.error("Error loading resume history:", error);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setLoading(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      setExtractedText(text);

      // Send to backend for analysis
      const analysis = await analyzeResume(text, file);
      setAnalysisResults(analysis);

      // Switch to results tab
      setActiveTab("results");

      // Reload history
      await loadResumeHistory();
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      console.log("FILE:::", file);
      const data = await pdf(file);
      console.log("DATAT:",data);

      // Create FormData to send file to API
      // const formData = new FormData();
      // formData.append("file", file);

      // // Send file to API route for processing
      // const response = await fetch("/api/resume/extract", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || "Failed to extract text from PDF");
      // }

      // const result = await response.json();

      // console.log("PDF Parse Results:");
      // console.log("Text Length:", result.data.textLength);
      // console.log("Number of Pages:", result.data.numpages);
      // console.log("PDF Info:", result.data.info);
      // console.log("Extracted Text:", result.data.text);

      // return result.data.text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF file");
    }
  };

  const analyzeResume = async (text, file) => {
    // Send to your backend API
    try {
      // const response = await api.post('/api/v1/resume/analyze', {
      //   text: text,
      //   fileName: file.name
      // });
      // return response.data;

      // Mock analysis results
      return {
        atsScore: 78,
        overallRating: 4.2,
        strengths: [
          "Strong technical skills section",
          "Relevant work experience",
          "Clear formatting and structure",
          "Quantified achievements",
        ],
        improvements: [
          "Add more industry keywords",
          "Include specific metrics in achievements",
          "Optimize for ATS compatibility",
          "Add relevant certifications",
          "Improve skills section organization",
        ],
        keywordAnalysis: {
          found: ["JavaScript", "React", "Node.js", "Python", "AWS"],
          missing: [
            "TypeScript",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Microservices",
          ],
        },
        sections: {
          contact: { score: 90, feedback: "Complete and professional" },
          summary: { score: 75, feedback: "Good but could be more impactful" },
          experience: {
            score: 85,
            feedback: "Well-structured with good details",
          },
          skills: { score: 70, feedback: "Missing some key technologies" },
          education: { score: 80, feedback: "Relevant and well-presented" },
        },
      };
    } catch (error) {
      throw new Error("Failed to analyze resume");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Uploads
                  </div>
                  <div className="text-2xl font-bold">
                    {resumeHistory.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Avg ATS Score
                  </div>
                  <div className="text-2xl font-bold">
                    {resumeHistory.length > 0
                      ? Math.round(
                          resumeHistory.reduce(
                            (acc, resume) => acc + resume.atsScore,
                            0
                          ) / resumeHistory.length
                        )
                      : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Improvements
                  </div>
                  <div className="text-2xl font-bold">
                    {resumeHistory.reduce(
                      (acc, resume) => acc + resume.suggestions,
                      0
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Best Score
                  </div>
                  <div className="text-2xl font-bold">
                    {resumeHistory.length > 0
                      ? Math.max(...resumeHistory.map((r) => r.atsScore))
                      : 0}
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
                // Handle resume selection from history
                console.log("Selected resume:", resume);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resume;
