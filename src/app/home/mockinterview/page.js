"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VapiInterview from "./components/VapiInterview";

export default function MockInterviewPage() {
  const [showInterview, setShowInterview] = useState(false);

  // Vapi Configuration - Replace with your actual credentials
  const VAPI_API_KEY =
    process.env.NEXT_PUBLIC_VAPI_API_KEY || "your_vapi_public_api_key";
  const VAPI_ASSISTANT_ID =
    process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "your_assistant_id";

  if (showInterview) {
    return (
      <div className="container mx-auto p-3 sm:p-4 md:p-6">
        <Button
          variant="outline"
          onClick={() => setShowInterview(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Interview Info
        </Button>
        <VapiInterview
          apiKey={VAPI_API_KEY}
          assistantId={VAPI_ASSISTANT_ID}
          interviewTitle="Technical Mock Interview"
          interviewRole="Software Engineering Position"
        />
      </div>
    );
  }

  // Mock data - replace with actual data
  const mockInterviews = [
    {
      id: 1,
      title: "Frontend Developer Mock Interview",
      role: "Frontend Developer",
      date: "2023-09-15",
      time: "14:30",
      duration: "45 min",
      interviewer: "John Doe",
      status: "scheduled",
      type: "Technical",
    },
    {
      id: 2,
      title: "System Design Interview",
      role: "SDE 2",
      date: "2023-09-17",
      time: "11:00",
      duration: "60 min",
      interviewer: "Jane Smith",
      status: "scheduled",
      type: "System Design",
    },
    {
      id: 3,
      title: "Behavioral Interview",
      role: "Product Manager",
      date: "2023-09-10",
      time: "16:00",
      duration: "30 min",
      interviewer: "Alex Johnson",
      status: "completed",
      type: "Behavioral",
    },
  ];

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">{
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            AI Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Practice with our AI-powered interviewer
          </p>
        </div>
      </div>
    }
      {/* Welcome Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome to AI Mock Interview
          </CardTitle>
          <CardDescription>
            Practice your interview skills with our AI-powered interviewer that
            simulates real technical interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Video className="mr-2 h-5 w-5 text-blue-600" />
                Voice Interview
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time voice conversation with AI interviewer
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Video className="mr-2 h-5 w-5 text-green-600" />
                Instant Feedback
              </h3>
              <p className="text-sm text-muted-foreground">
                Get real-time transcript and analysis
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Video className="mr-2 h-5 w-5 text-purple-600" />
                Flexible Practice
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice anytime, anywhere at your own pace
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">What to Expect:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Technical questions tailored to your role and experience level
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Natural conversation flow with follow-up questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Real-time transcript of the entire conversation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Practice as many times as you need</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              size="lg"
              onClick={() => setShowInterview(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Video className="mr-2 h-5 w-5" />
              Start Mock Interview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Preparation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Before the Interview:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ensure your microphone is working</li>
                <li>• Find a quiet environment</li>
                <li>• Have a glass of water nearby</li>
                <li>• Review common interview questions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">During the Interview:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Take your time to think before answering</li>
                <li>• Use specific examples from your experience</li>
                <li>• Ask for clarification if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
