"use client";

import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function VapiInterview({
  apiKey,
  assistantId,
  interviewTitle = "Mock Interview",
  interviewRole = "Technical Interview",
}) {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    try {
      const vapiInstance = new Vapi(apiKey);
      setVapi(vapiInstance);

      // Event listeners
      vapiInstance.on("call-start", () => {
        console.log("Interview call started");
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
        startTimer();
      });

      vapiInstance.on("call-end", () => {
        console.log("Interview call ended");
        setIsConnected(false);
        setIsSpeaking(false);
        setIsLoading(false);
        stopTimer();
      });

      vapiInstance.on("speech-start", () => {
        console.log("Interviewer started speaking");
        setIsSpeaking(true);
      });

      vapiInstance.on("speech-end", () => {
        console.log("Interviewer stopped speaking");
        setIsSpeaking(false);
      });

      vapiInstance.on("message", (message) => {
        console.log("Message received:", message);
        if (message.type === "transcript") {
          setTranscript((prev) => [
            ...prev,
            {
              role: message.role,
              text: message.transcript,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      });

      vapiInstance.on("error", (error) => {
        console.error("Vapi error:", error);
        setError(error.message || "An error occurred during the interview");
        setIsLoading(false);
        setIsConnected(false);
      });

      return () => {
        vapiInstance?.stop();
        stopTimer();
      };
    } catch (err) {
      console.error("Failed to initialize Vapi:", err);
      setError("Failed to initialize interview system");
    }
  }, [apiKey]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startInterview = async () => {
    if (vapi && !isConnected) {
      try {
        setIsLoading(true);
        setError(null);
        setTranscript([]);
        setCallDuration(0);
        await vapi.start(assistantId);
      } catch (err) {
        console.error("Failed to start interview:", err);
        setError("Failed to start interview. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const endInterview = () => {
    if (vapi) {
      vapi.stop();
      stopTimer();
    }
  };

  const toggleMute = () => {
    if (vapi) {
      vapi.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col gap-6">
      {/* Interview Header */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{interviewTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {interviewRole}
              </p>
            </div>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isConnected ? "In Progress" : "Ready"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/20 flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Interview Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Control Panel */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden min-h-[400px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 overflow-y-auto">
            {/* Start/End Interview Button */}
            {!isConnected ? (
              <Button
                onClick={startInterview}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Start Interview
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={endInterview}
                variant="destructive"
                className="w-full h-14 text-lg"
              >
                <PhoneOff className="mr-2 h-5 w-5" />
                End Interview
              </Button>
            )}

            {/* Mute Button */}
            {isConnected && (
              <Button onClick={toggleMute} variant="outline" className="w-full">
                {isMuted ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Mute
                  </>
                )}
              </Button>
            )}

            {/* Interview Stats */}
            {isConnected && (
              <div className="pt-4 space-y-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-mono font-medium">
                    {formatDuration(callDuration)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">
                    {transcript.filter((t) => t.role === "assistant").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center space-x-2">
                    {isSpeaking ? (
                      <>
                        <Volume2 className="h-4 w-4 text-blue-500 animate-pulse" />
                        <span className="text-blue-500">
                          Interviewer Speaking
                        </span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Your Turn</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isConnected && (
              <div className="pt-4 space-y-2 border-t">
                <h4 className="font-medium text-sm">Instructions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Ensure microphone access is allowed</li>
                  <li>Find a quiet environment</li>
                  <li>Speak clearly and naturally</li>
                  <li>Take your time to answer</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transcript Panel */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden min-h-[500px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg">Interview Transcript</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg">
              {transcript.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {isConnected ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Waiting for conversation to start...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Start Interview" to begin</p>
                      <p className="text-sm">
                        The conversation transcript will appear here
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 border"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium opacity-70">
                            {msg.role === "user" ? "You" : "Interviewer"}
                          </span>
                          <span className="text-xs opacity-50">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
