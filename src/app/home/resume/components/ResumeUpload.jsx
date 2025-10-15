"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Cloud,
} from "lucide-react";

const ResumeUpload = ({ onFileUpload, loading, uploadedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Process file
  const handleFile = (file) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB.");
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    onFileUpload(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Upload Your Resume</span>
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF format to get detailed ATS analysis and
            improvement suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-black/40 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-sm">PDF Format</div>
                <div className="text-xs text-muted-foreground">
                  Only PDF files accepted
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-black/40 rounded-lg">
              <Cloud className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-medium text-sm">Max 10MB</div>
                <div className="text-xs text-muted-foreground">
                  File size limit
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-black/40 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-medium text-sm">Secure</div>
                <div className="text-xs text-muted-foreground">
                  Files processed securely
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            } ${loading ? "pointer-events-none opacity-50" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto animate-spin" />
                <div>
                  <h3 className="text-lg font-medium">Processing Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Extracting text and analyzing content...
                  </p>
                </div>
                <Progress
                  value={uploadProgress}
                  className="w-full max-w-md mx-auto"
                />
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-400">
                    File Uploaded Successfully
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Upload Another Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Or click to browse and select a PDF file
                  </p>
                </div>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() =>
                    document.getElementById("resume-upload").click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose PDF File
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Tips for Better Analysis
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>
                  • Ensure your PDF is text-selectable (not scanned images)
                </li>
                <li>• Include relevant keywords for your target industry</li>
                <li>• Use a clean, professional format</li>
                <li>• Keep file size under 10MB for faster processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeUpload;
