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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Search,
  Filter,
  ExternalLink,
  Building2,
  Loader2,
  TrendingUp,
  Star,
  Calendar,
  Wifi,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck,
  Award,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Openings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // 6 jobs per page (2 rows x 3 columns)
  const [stats, setStats] = useState({
    totalJobs: 0,
    remoteJobs: 0,
    avgSalary: "$150k",
    topCompanies: 12,
  });
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, [searchQuery, locationFilter, typeFilter, sortFilter]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchQuery, locationFilter, typeFilter, sortFilter]);

  const loadSavedJobs = () => {
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(saved.map((j) => j.id));
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (locationFilter) params.append("location", locationFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (sortFilter) params.append("filter", sortFilter);

      const response = await fetch(`/api/openings?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.data.jobs);
        updateStats(data.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (jobsList) => {
    const remoteCount = jobsList.filter((j) => j.remote).length;
    setStats({
      totalJobs: jobsList.length,
      remoteJobs: remoteCount,
      avgSalary: "$150k",
      topCompanies: new Set(jobsList.map((j) => j.company)).size,
    });
  };

  const handleApply = (job) => {
    // Open job application link or redirect
    if (job.applyLink) {
      window.open(job.applyLink, "_blank");
    } else if (job.jobUrl) {
      window.open(job.jobUrl, "_blank");
    } else {
      alert(`Application for ${job.title} at ${job.company}!\n\nThis would redirect to the company's application page.`);
    }
  };

  const handleSaveJob = (job) => {
    const currentSaved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const isAlreadySaved = currentSaved.some((j) => j.id === job.id);

    if (isAlreadySaved) {
      const updated = currentSaved.filter((j) => j.id !== job.id);
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setSavedJobs(updated.map((j) => j.id));
    } else {
      const updated = [...currentSaved, job];
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setSavedJobs(updated.map((j) => j.id));
    }
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => paginate(1);
  const goToLastPage = () => paginate(totalPages);
  const goToPreviousPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Modern Header with Glassmorphism */}
      <div className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative p-2 sm:p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  Job Openings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                  <Target className="h-3 w-3" />
                  Find your dream job from top tech companies
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <Award className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">Live Jobs</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Card className="relative overflow-hidden bg-blue-600 border-0 text-white group hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total Openings
                </CardTitle>
                <Briefcase className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.totalJobs}</div>
              <p className="text-xs opacity-80 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Active positions
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-green-600 border-0 text-white group hover:shadow-2xl hover:shadow-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Remote Jobs</CardTitle>
                <Wifi className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.remoteJobs}</div>
              <p className="text-xs opacity-80">Work from anywhere</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-blue-600 border-0 text-white group hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Avg Salary</CardTitle>
                <DollarSign className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.avgSalary}</div>
              <p className="text-xs opacity-80">Annual package</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-blue-600 border-0 text-white group hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Companies</CardTitle>
                <Building2 className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.topCompanies}</div>
              <p className="text-xs opacity-80">Top tech firms</p>
            </CardContent>
          </Card>
        </div>

        {/* Modern Search & Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="bg-blue-50 dark:bg-gray-800 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-blue-600" />
              Smart Job Search
            </CardTitle>
            <CardDescription>Use AI-powered filters to find your perfect role</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors z-10" />
                <Input
                  placeholder="Location (e.g., San Francisco)"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-all"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-2 focus:border-green-500 dark:focus:border-green-400">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="remote">🏠 Remote</SelectItem>
                  <SelectItem value="onsite">🏢 On-site</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortFilter} onValueChange={setSortFilter}>
                <SelectTrigger className="border-2 focus:border-orange-500 dark:focus:border-orange-400">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">✨ All Jobs</SelectItem>
                  <SelectItem value="recent">🕒 Recent</SelectItem>
                  <SelectItem value="popular">🔥 Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
              {currentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm flex-shrink-0">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1 line-clamp-1">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Building2 className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{job.company}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {job.remote && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          <Wifi className="h-3 w-3 mr-1" />
                          Remote
                        </Badge>
                      )}
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="font-medium truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="truncate">{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        <span className="truncate">{job.posted}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-950/50 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Users className="h-3 w-3" />
                      <span>{job.applicants} applicants</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-sm"
                        onClick={() => handleApply(job)}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isJobSaved(job.id)
                            ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-500 text-yellow-700 dark:text-yellow-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        } transition-all`}
                        onClick={() => handleSaveJob(job)}
                      >
                        {isJobSaved(job.id) ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <BookmarkPlus className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results Info */}
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{indexOfFirstJob + 1}</span> to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(indexOfLastJob, jobs.length)}
                      </span>{" "}
                      of <span className="font-medium text-foreground">{jobs.length}</span> jobs
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                      {/* First Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>

                      {/* Previous Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum, index) => (
                          pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => paginate(pageNum)}
                              className={`h-9 w-9 p-0 ${
                                currentPage === pageNum
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : ""
                              }`}
                            >
                              {pageNum}
                            </Button>
                          )
                        ))}
                      </div>

                      {/* Next Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Last Page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Openings;