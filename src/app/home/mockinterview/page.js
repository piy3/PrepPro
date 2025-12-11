'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Users, Briefcase, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Added missing import

export default function MockInterviewPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock data - replace with actual data
  const mockInterviews = [
    {
      id: 1,
      title: 'Frontend Developer Mock Interview',
      role: 'Frontend Developer',
      date: '2023-09-15',
      time: '14:30',
      duration: '45 min',
      interviewer: 'John Doe',
      status: 'scheduled',
      type: 'Technical'
    },
    {
      id: 2,
      title: 'System Design Interview',
      role: 'SDE 2',
      date: '2023-09-17',
      time: '11:00',
      duration: '60 min',
      interviewer: 'Jane Smith',
      status: 'scheduled',
      type: 'System Design'
    },
    {
      id: 3,
      title: 'Behavioral Interview',
      role: 'Product Manager',
      date: '2023-09-10',
      time: '16:00',
      duration: '30 min',
      interviewer: 'Alex Johnson',
      status: 'completed',
      type: 'Behavioral'
    }
  ];

  const filteredInterviews = mockInterviews.filter(interview => 
    activeTab === 'upcoming' ? interview.status === 'scheduled' : interview.status === 'completed'
  );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Mock Interviews</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Practice and prepare for your next interview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interviews..."
              className="w-full pl-8"
            />
          </div>
          <Button className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="upcoming" 
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filteredInterviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No {activeTab} interviews</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === 'upcoming' 
                ? 'Schedule a new mock interview to get started' 
                : 'Your completed interviews will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            )}
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{interview.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {interview.role} • {interview.type}
                    </CardDescription>
                  </div>
                  <Badge variant={interview.status === 'scheduled' ? 'default' : 'secondary'}>
                    {interview.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{interview.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{interview.time} • {interview.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>With {interview.interviewer}</span>
                  </div>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Video Call</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {interview.status === 'scheduled' && (
                  <>
                    <Button variant="outline">Reschedule</Button>
                    <Button>Join Interview</Button>
                  </>
                )}
                {interview.status === 'completed' && (
                  <Button variant="outline">View Feedback</Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}