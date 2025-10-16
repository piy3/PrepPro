"use client";

import { useState } from "react";
import toast from "react-hot-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Bug,
  Lightbulb,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Settings,
  Shield,
  Zap,
  FileText,
  Star,
} from "lucide-react";

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    type: "",
    priority: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      id: 1,
      category: "General",
      question:
        "What is PrepPro and how does it help with placement preparation?",
      answer:
        "PrepPro is a comprehensive placement preparation platform that offers quiz systems, aptitude practice, resume analysis, mock interviews, and study materials. It helps students prepare for technical interviews and placement drives with real-time feedback and performance tracking.",
    },
    {
      id: 2,
      category: "Quizzes",
      question: "How do the timed quizzes work?",
      answer:
        "Each quiz has a time limit of 1 minute per question. You cannot go back to previous questions, and the quiz auto-submits when complete. Your answers are saved automatically, and you'll see your results with rankings immediately after submission.",
    },
    {
      id: 3,
      category: "Resume Analyzer",
      question: "What file formats are supported for resume analysis?",
      answer:
        "Currently, we support PDF files for resume analysis. Our system extracts text from your PDF resume and provides ATS optimization suggestions, keyword analysis, and improvement recommendations.",
    },
    {
      id: 4,
      category: "Aptitude",
      question: "What topics are covered in aptitude practice?",
      answer:
        "We cover 9 major aptitude topics including Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Programming Concepts, Computer Networks, Operating Systems, Database Management, and Software Engineering.",
    },
    {
      id: 5,
      category: "Account",
      question: "How do I track my progress and performance?",
      answer:
        "Your dashboard shows detailed analytics including quiz scores, time taken, rankings, improvement suggestions, and historical performance. You can track your progress across different topics and see your improvement over time.",
    },
    {
      id: 6,
      category: "Technical",
      question: "What browsers are supported?",
      answer:
        "PrepPro works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience. The platform also supports both light and dark modes.",
    },
    {
      id: 7,
      category: "Pricing",
      question: "Is PrepPro free to use?",
      answer:
        "We offer both free and premium features. Basic quizzes, aptitude practice, and resume analysis are available for free. Premium features include advanced analytics, unlimited attempts, and priority support.",
    },
    {
      id: 8,
      category: "Privacy",
      question: "How is my data protected?",
      answer:
        "We take data privacy seriously. All your personal information and uploaded documents are encrypted and stored securely. We never share your data with third parties without your explicit consent. You can delete your account and data anytime.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "yadavpiy02@gmail.com",
      responseTime: "Within 24 hours",
    },
    // {
    //   icon: MessageSquare,
    //   title: "Live Chat",
    //   description: "Chat with our support team",
    //   contact: "Available 9 AM - 6 PM IST",
    //   responseTime: "Immediate",
    // },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for urgent issues",
      contact: "+91-9696683107",
      responseTime: "Business hours only",
    },
  ];

  const filterFaqs = (category) => {
    if (!searchQuery && !category) return faqs;

    return faqs.filter((faq) => {
      const matchesSearch = searchQuery
        ? faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = category ? faq.category === category : true;

      return matchesSearch && matchesCategory;
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine which API endpoint to use based on active tab
      let endpoint = "/api/contact";
      let successMessage =
        "Your message has been sent successfully! We'll get back to you soon.";

      if (activeTab === "bug-report") {
        endpoint = "/api/bug-report";
        successMessage =
          "Bug report submitted successfully! We'll investigate this issue promptly.";
      } else if (activeTab === "feature-request") {
        endpoint = "/api/feature-request";
        successMessage =
          "Feature request submitted successfully! We'll review your suggestion.";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success(successMessage);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        type: "",
        priority: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const categories = ["All", ...new Set(faqs.map((faq) => faq.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-black">
      {/* Header */}
      <div className="bg-white/50 dark:bg-black/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Help & Support
                </h1>
                <p className="text-muted-foreground">
                  Get help, report issues, or request new features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us
            </TabsTrigger>
            <TabsTrigger
              value="bug-report"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Bug className="h-4 w-4 mr-2" />
              Report Bug
            </TabsTrigger>
            <TabsTrigger
              value="feature-request"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Request Feature
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                      onClick={() =>
                        setSearchQuery(category === "All" ? "" : category)
                      }
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filterFaqs().map((faq) => (
                    <Card
                      key={faq.id}
                      className="bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
                    >
                      <CardContent className="p-0">
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              expandedFaq === faq.id ? null : faq.id
                            )
                          }
                          className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <Badge variant="secondary" className="mt-1">
                              {faq.category}
                            </Badge>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <div className="px-4 pb-4">
                            <div className="ml-20 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Methods */}
              <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Get in Touch</span>
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred way to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg border bg-background/30 hover:bg-background/50 transition-colors"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                        <method.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <div className="text-sm">
                          <div className="font-medium">{method.contact}</div>
                          <div className="text-muted-foreground">
                            {method.responseTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Send Message</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out the form and we'll get back to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="technical">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("priority", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bug Report Tab */}
          <TabsContent value="bug-report" className="space-y-6">
            <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span>Report a Bug</span>
                </CardTitle>
                <CardDescription>
                  Help us improve by reporting bugs and issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bug-name">Your Name</Label>
                      <Input
                        id="bug-name"
                        value={contactForm.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bug-email">Email</Label>
                      <Input
                        id="bug-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bug-title">Bug Title</Label>
                    <Input
                      id="bug-title"
                      placeholder="Brief description of the bug"
                      value={contactForm.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Severity</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Low - Minor inconvenience
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium - Affects functionality
                          </SelectItem>
                          <SelectItem value="high">
                            High - Major feature broken
                          </SelectItem>
                          <SelectItem value="critical">
                            Critical - App unusable
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Browser</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select browser" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chrome">Chrome</SelectItem>
                          <SelectItem value="firefox">Firefox</SelectItem>
                          <SelectItem value="safari">Safari</SelectItem>
                          <SelectItem value="edge">Edge</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bug-description">Bug Description</Label>
                    <Textarea
                      id="bug-description"
                      rows={4}
                      placeholder="Describe the bug, steps to reproduce, expected vs actual behavior..."
                      value={contactForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          Include these details for faster resolution:
                        </p>
                        <ul className="mt-2 text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                          <li>Steps to reproduce the bug</li>
                          <li>Expected behavior vs actual behavior</li>
                          <li>Device type and operating system</li>
                          <li>Any error messages or screenshots</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Bug className="h-4 w-4 mr-2" />
                        Submit Bug Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Request Tab */}
          <TabsContent value="feature-request" className="space-y-6">
            <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>Request a Feature</span>
                </CardTitle>
                <CardDescription>
                  Share your ideas to help us improve PrepPro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feature-name">Your Name</Label>
                      <Input
                        id="feature-name"
                        value={contactForm.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature-email">Email</Label>
                      <Input
                        id="feature-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feature-title">Feature Title</Label>
                    <Input
                      id="feature-title"
                      placeholder="Brief name for your feature idea"
                      value={contactForm.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quiz">Quiz System</SelectItem>
                          <SelectItem value="aptitude">
                            Aptitude Practice
                          </SelectItem>
                          <SelectItem value="resume">
                            Resume Analyzer
                          </SelectItem>
                          <SelectItem value="interview">
                            Mock Interview
                          </SelectItem>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How important?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nice-to-have">
                            Nice to have
                          </SelectItem>
                          <SelectItem value="important">Important</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feature-description">
                      Feature Description
                    </Label>
                    <Textarea
                      id="feature-description"
                      rows={4}
                      placeholder="Describe your feature idea, how it would work, and why it would be valuable..."
                      value={contactForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          Great feature requests include:
                        </p>
                        <ul className="mt-2 text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                          <li>Clear problem statement</li>
                          <li>Proposed solution or approach</li>
                          <li>Expected benefits for users</li>
                          <li>Any similar features you've seen elsewhere</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Submit Feature Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpSupport;
