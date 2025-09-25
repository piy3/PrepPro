'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trophy, Briefcase, Users, MessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ModeToggle } from '@/components/ModeToggle';

const Page = () => {
  const [progress, setProgress] = useState(65);
  
  const upcomingInterviews = [
    { id: 1, company: 'TechCorp', role: 'Frontend Developer', date: '2023-12-15', time: '10:00 AM' },
    { id: 2, company: 'DataSystems', role: 'Data Scientist', date: '2023-12-18', time: '2:30 PM' },
  ];

  const quickActions = [
    { id: 1, title: 'Resume Review', icon: BookOpen, description: 'Get your resume reviewed by experts', color: 'bg-blue-100 text-blue-600' },
    { id: 2, title: 'Mock Interview', icon: MessageSquare, description: 'Practice with industry professionals', color: 'bg-purple-100 text-purple-600' },
    { id: 3, title: 'Job Search', icon: Briefcase, description: 'Find your dream job', color: 'bg-green-100 text-green-600' },
    { id: 4, title: 'Skill Assessment', icon: BookOpen, description: 'Test your technical skills', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your job search.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Strength</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Interviews */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>You have {upcomingInterviews.length} interviews scheduled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-4">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{interview.company}</div>
                    <div className="text-sm text-muted-foreground">{interview.role}</div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {interview.date} • {interview.time}
                  </div>
                </div>
              ))}
              {upcomingInterviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming interviews scheduled.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your job search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto py-3 justify-start px-4 text-left"
                >
                  <div className={`p-2 rounded-full mr-3 ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent job search activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start pb-4 last:pb-0 last:border-0">
                <div className="h-2 w-2 rounded-full bg-sky-500 mt-2 mr-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item === 1 && 'Application submitted at TechCorp'}
                    {item === 2 && 'Interview scheduled with DataSystems'}
                    {item === 3 && 'Profile viewed by 5 recruiters'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item === 1 && '2 days ago'}
                    {item === 2 && '1 week ago'}
                    {item === 3 && '2 weeks ago'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;