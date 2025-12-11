'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  Users, 
  MessageSquare,
  FileText,
  TrendingUp,
  Video,
  Newspaper,
  ArrowUpRight,
  ChevronRight,
  Upload,
  Bookmark,
  Eye,
  GraduationCap
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    resumeUploads: 0,
    resumeScore: 0,
    savedJobs: 0,
    bookmarkedArticles: 0,
    totalArticles: 0,
    totalJobs: 0,
    totalStudyMaterials: 0,
  });
  const [recentResumes, setRecentResumes] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load resume data from localStorage
      const resumeHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      const uploadCounter = parseInt(localStorage.getItem('totalUploadsCounter') || '0');
      const latestResume = resumeHistory[0];
      
      // Load saved jobs
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      
      // Load bookmarked articles
      const bookmarkedData = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
      
      // Fetch total counts from APIs
      const [jobsRes, articlesRes, studyRes] = await Promise.all([
        fetch('/api/openings').catch(() => ({ json: async () => ({ success: false }) })),
        fetch('/api/articles').catch(() => ({ json: async () => ({ success: false }) })),
        fetch('/api/study').catch(() => ({ json: async () => ({ success: false }) })),
      ]);

      const jobsData = await jobsRes.json();
      const articlesData = await articlesRes.json();
      const studyData = await studyRes.json();

      setStats({
        resumeUploads: uploadCounter,
        resumeScore: latestResume?.overallScore || 0,
        savedJobs: savedJobsData.length,
        bookmarkedArticles: bookmarkedData.length,
        totalArticles: articlesData.success ? articlesData.data.articles.length : 0,
        totalJobs: jobsData.success ? jobsData.data.jobs.length : 0,
        totalStudyMaterials: studyData.success ? studyData.data.stats.totalMaterials : 0,
      });

      setRecentResumes(resumeHistory.slice(0, 3));
      setSavedJobs(savedJobsData.slice(0, 3));
      setBookmarkedArticles(bookmarkedData.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      id: 1, 
      title: 'Analyze Resume', 
      icon: FileText, 
      description: 'Upload and analyze your resume', 
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      route: '/home/resume'
    },
    { 
      id: 2, 
      title: 'Browse Jobs', 
      icon: Briefcase, 
      description: 'Find your dream job', 
      color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
      route: '/home/openings'
    },
    { 
      id: 3, 
      title: 'Study Materials', 
      icon: BookOpen, 
      description: 'Access books and tutorials', 
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
      route: '/home/study'
    },
    { 
      id: 4, 
      title: 'Latest Articles', 
      icon: Newspaper, 
      description: 'Read tech news and insights', 
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      route: '/home/articles'
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your placement preparation progress</p>
          </div>
          <Badge variant="outline" className="px-4 py-2 bg-blue-50 dark:bg-blue-950">
            <GraduationCap className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300">PrepPro</span>
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resume Uploads</CardTitle>
              <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.resumeUploads}</div>
              <p className="text-xs text-muted-foreground mt-1">Total resumes analyzed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ATS Score</CardTitle>
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resumeScore}%</div>
              <div className="mt-2">
                <Progress value={stats.resumeScore} className="h-2 bg-gray-200 dark:bg-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
              <Bookmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.savedJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">From {stats.totalJobs} available</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalStudyMaterials}</div>
              <p className="text-xs text-muted-foreground mt-1">Books & video tutorials</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Resumes */}
          <Card className="col-span-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Recent Resume Analysis
                  </CardTitle>
                  <CardDescription className="mt-1">Your latest resume uploads and scores</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/home/resume')}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResumes.length > 0 ? (
                  recentResumes.map((resume, index) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 mr-4">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{resume.fileName}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(resume.uploadDate)}</div>
                      </div>
                      <div className="ml-4">
                        <Badge className={`${
                          resume.overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                          resume.overallScore >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}>
                          {resume.overallScore}% ATS
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No resumes analyzed yet</p>
                    <Button onClick={() => router.push('/home/resume')} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to key features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto py-3 justify-start px-4 text-left hover:shadow-md transition-all border-gray-200 dark:border-gray-700"
                    onClick={() => router.push(action.route)}
                  >
                    <div className={`p-2 rounded-full mr-3 ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Jobs and Bookmarks */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Saved Jobs */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Saved Jobs
                  </CardTitle>
                  <CardDescription className="mt-1">Jobs you've bookmarked</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/home/openings')}
                  className="hover:bg-green-50 dark:hover:bg-green-950"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedJobs.length > 0 ? (
                  savedJobs.map((job, index) => (
                    <div key={index} className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                        {job.company?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No saved jobs yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bookmarked Articles */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Bookmarked Articles
                  </CardTitle>
                  <CardDescription className="mt-1">Articles saved for later</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/home/articles')}
                  className="hover:bg-amber-50 dark:hover:bg-amber-950"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookmarkedArticles.length > 0 ? (
                  bookmarkedArticles.map((article, index) => (
                    <div key={index} className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => article.url && window.open(article.url, '_blank')}
                    >
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">{article.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{article.summary}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No bookmarked articles yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;