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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Video,
  Search,
  Star,
  ExternalLink,
  Loader2,
  Library,
  PlayCircle,
  Filter,
  GraduationCap,
  BookMarked,
  Youtube,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Study = () => {
  const [materials, setMaterials] = useState([]);
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    booksCount: 0,
    videosCount: 0,
    categories: [],
  });

  useEffect(() => {
    fetchMaterials();
  }, [searchQuery, category, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, activeTab]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (category !== "all") params.append("category", category);
      params.append("type", activeTab);

      const response = await fetch(`/api/study?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setMaterials(data.data.materials);
        setBooks(data.data.books);
        setVideos(data.data.videos);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentItems = () => {
    const items = activeTab === "all" ? materials : activeTab === "books" ? books : videos;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    const items = activeTab === "all" ? materials : activeTab === "books" ? books : videos;
    return Math.ceil(items.length / itemsPerPage);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
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

  const handleOpenMaterial = (material) => {
    if (material.type === 'book' && material.previewLink) {
      window.open(material.previewLink, "_blank");
    } else if (material.type === 'video' && material.videoUrl) {
      window.open(material.videoUrl, "_blank");
    } else if (material.infoLink) {
      window.open(material.infoLink, "_blank");
    }
  };

  const currentItems = getCurrentItems();
  const totalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-7 w-7 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  Study Materials
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <BookMarked className="h-3 w-3" />
                  Books, Videos & Resources for Interview Prep
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Library className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">Free Resources</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-blue-600 border-0 text-white group hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total Resources
                </CardTitle>
                <Library className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.totalMaterials}</div>
              <p className="text-xs opacity-80">Books & Videos</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-green-600 border-0 text-white group hover:shadow-2xl hover:shadow-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Books</CardTitle>
                <BookOpen className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.booksCount}</div>
              <p className="text-xs opacity-80">Technical books</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-blue-600 border-0 text-white group hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Video Tutorials</CardTitle>
                <Video className="h-5 w-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{stats.videosCount}</div>
              <p className="text-xs opacity-80">Learn by watching</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="bg-blue-50 dark:bg-gray-800 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-blue-600" />
              Search Study Materials
            </CardTitle>
            <CardDescription>Find books, videos, and tutorials for your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-2 focus:border-blue-500 dark:focus:border-blue-400">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="algorithms">📊 Algorithms & DS</SelectItem>
                  <SelectItem value="system design">🏗️ System Design</SelectItem>
                  <SelectItem value="javascript">⚡ JavaScript</SelectItem>
                  <SelectItem value="react">⚛️ React</SelectItem>
                  <SelectItem value="python">🐍 Python</SelectItem>
                  <SelectItem value="database">🗄️ Databases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Library className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="books" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Books
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : currentItems.length === 0 ? (
          <Card className="bg-white/50 dark:bg-black/60 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentItems.map((material) => (
                <Card
                  key={material.id}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-20 h-28 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm flex-shrink-0">
                        <img
                          src={material.thumbnail}
                          alt={material.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(material.title)}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={material.type === 'book' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}>
                            {material.type === 'book' ? (
                              <><BookOpen className="h-3 w-3 mr-1" /> Book</>
                            ) : (
                              <><Youtube className="h-3 w-3 mr-1" /> Video</>
                            )}
                          </Badge>
                        </div>
                        <CardTitle className="text-base mb-1 line-clamp-2">
                          {material.title}
                        </CardTitle>
                        {material.type === 'book' && material.authors && (
                          <CardDescription className="text-xs flex items-center gap-1 mb-1">
                            <User className="h-3 w-3" />
                            {material.authors.slice(0, 2).join(", ")}
                          </CardDescription>
                        )}
                        {material.type === 'video' && material.channel && (
                          <CardDescription className="text-xs flex items-center gap-1 mb-1">
                            <User className="h-3 w-3" />
                            {material.channel}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {material.description}
                    </p>

                    <div className="space-y-2 mb-4 text-xs">
                      {material.publishedDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span>{new Date(material.publishedDate).getFullYear()}</span>
                        </div>
                      )}
                      {material.pageCount && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span>{material.pageCount} pages</span>
                        </div>
                      )}
                      {material.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                          <span>{material.rating.toFixed(1)} ({material.ratingsCount || 0} reviews)</span>
                        </div>
                      )}
                    </div>

                    {material.categories && material.categories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {material.categories.slice(0, 2).map((cat, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 dark:bg-blue-950/50 text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-auto bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-sm"
                      onClick={() => handleOpenMaterial(material)}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      {material.type === 'book' ? 'View Book' : 'Watch Video'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(currentPage * itemsPerPage, activeTab === "all" ? materials.length : activeTab === "books" ? books.length : videos.length)}
                      </span>{" "}
                      of <span className="font-medium text-foreground">{activeTab === "all" ? materials.length : activeTab === "books" ? books.length : videos.length}</span> materials
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(totalPages)}
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

export default Study;