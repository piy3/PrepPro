"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  ExternalLink,
  Filter,
  Bookmark,
  Share2,
  TrendingUp,
  Code,
  Cpu,
  Award,
  Car,
  Microscope,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ArticlesPage() {
  // State management
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // Categories configuration
  const categories = [
    {
      id: "all",
      label: "All Articles",
      icon: Globe,
      color: "bg-blue-500",
      keywords: [],
    },
    {
      id: "development",
      label: "Development",
      icon: Code,
      color: "bg-green-500",
      keywords: [
        "programming",
        "coding",
        "software",
        "web",
        "app",
        "javascript",
        "python",
        "react",
        "development",
      ],
    },
    {
      id: "algorithms",
      label: "Algorithms",
      icon: Cpu,
      color: "bg-purple-500",
      keywords: [
        "algorithm",
        "data structure",
        "sorting",
        "search",
        "optimization",
        "machine learning",
        "AI",
      ],
    },
    {
      id: "science",
      label: "Science Awards",
      icon: Award,
      color: "bg-yellow-500",
      keywords: [
        "nobel",
        "award",
        "prize",
        "science",
        "research",
        "breakthrough",
        "discovery",
        "innovation",
      ],
    },
    {
      id: "automobiles",
      label: "Automobile Tech",
      icon: Car,
      color: "bg-red-500",
      keywords: [
        "car",
        "automobile",
        "vehicle",
        "electric",
        "tesla",
        "autonomous",
        "automotive",
        "transport",
      ],
    },
    {
      id: "discovery",
      label: "New Discovery",
      icon: Microscope,
      color: "bg-indigo-500",
      keywords: [
        "discovery",
        "research",
        "study",
        "findings",
        "breakthrough",
        "experiment",
        "innovation",
        "technology",
      ],
    },
  ];

  // Mock articles data - In real app, this would come from an API
  const mockArticles = [
    {
      id: 1,
      title:
        "Revolutionary AI Algorithm Breaks Speed Records in Data Processing",
      summary:
        "Researchers develop a new machine learning algorithm that processes big data 10x faster than traditional methods.",
      category: "algorithms",
      author: "Dr. Sarah Chen",
      publishedDate: "2024-10-15",
      readTime: "5 min read",
      views: 12500,
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
      tags: ["AI", "Machine Learning", "Big Data", "Performance"],
      trending: true,
    },
    {
      id: 2,
      title: "Nobel Prize 2024: Groundbreaking Work in Quantum Computing",
      summary:
        "This year's physics Nobel Prize recognizes pioneering research in quantum error correction and fault-tolerant quantum computers.",
      category: "science",
      author: "Physics Committee",
      publishedDate: "2024-10-14",
      readTime: "8 min read",
      views: 25600,
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop",
      tags: ["Nobel Prize", "Quantum Computing", "Physics", "Research"],
      trending: true,
    },
    {
      id: 3,
      title: "Next.js 15 Released: Revolutionary App Router Improvements",
      summary:
        "The latest Next.js update brings significant performance improvements and new developer experience features.",
      category: "development",
      author: "Vercel Team",
      publishedDate: "2024-10-13",
      readTime: "6 min read",
      views: 18900,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
      tags: ["Next.js", "React", "Web Development", "Performance"],
      trending: false,
    },
    {
      id: 4,
      title: "Tesla's New Battery Technology Doubles Electric Vehicle Range",
      summary:
        "Revolutionary solid-state battery technology promises to transform the electric vehicle industry with unprecedented range and charging speed.",
      category: "automobiles",
      author: "Auto Tech Weekly",
      publishedDate: "2024-10-12",
      readTime: "7 min read",
      views: 31200,
      image:
        "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=300&fit=crop",
      tags: ["Tesla", "Electric Vehicles", "Battery", "Innovation"],
      trending: true,
    },
    {
      id: 5,
      title: "Scientists Discover New Exoplanet with Potential for Life",
      summary:
        "Astronomers have identified a potentially habitable exoplanet in the Goldilocks zone of a nearby star system.",
      category: "discovery",
      author: "NASA Research Team",
      publishedDate: "2024-10-11",
      readTime: "9 min read",
      views: 42100,
      image:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop",
      tags: ["Space", "Exoplanet", "Astronomy", "Life"],
      trending: true,
    },
    {
      id: 6,
      title: "Advanced Graph Algorithms for Social Network Analysis",
      summary:
        "New algorithmic approaches for analyzing complex social networks and predicting user behavior patterns.",
      category: "algorithms",
      author: "Dr. Michael Rodriguez",
      publishedDate: "2024-10-10",
      readTime: "12 min read",
      views: 8700,
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
      tags: ["Graph Theory", "Social Networks", "Data Analysis", "Algorithms"],
      trending: false,
    },
    {
      id: 7,
      title: "Breakthrough in Gene Therapy Wins Medical Research Award",
      summary:
        "Revolutionary CRISPR-based treatment for genetic disorders receives prestigious international recognition.",
      category: "science",
      author: "Medical Research Foundation",
      publishedDate: "2024-10-09",
      readTime: "10 min read",
      views: 19800,
      image:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=500&h=300&fit=crop",
      tags: ["Gene Therapy", "CRISPR", "Medical Research", "Award"],
      trending: false,
    },
    {
      id: 8,
      title: "React 19: Server Components and Concurrent Features",
      summary:
        "Exploring the latest React features including improved server components and enhanced concurrent rendering capabilities.",
      category: "development",
      author: "React Team",
      publishedDate: "2024-10-08",
      readTime: "11 min read",
      views: 22400,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
      tags: ["React", "Server Components", "JavaScript", "Frontend"],
      trending: false,
    },
    {
      id: 9,
      title: "Autonomous Vehicles: The Future of Urban Transportation",
      summary:
        "How self-driving cars are reshaping city planning and transportation infrastructure worldwide.",
      category: "automobiles",
      author: "Urban Tech Institute",
      publishedDate: "2024-10-07",
      readTime: "8 min read",
      views: 15600,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop",
      tags: [
        "Autonomous Vehicles",
        "Transportation",
        "Smart Cities",
        "Technology",
      ],
      trending: false,
    },
    {
      id: 10,
      title: "Quantum Internet: First Successful Long-Distance Transmission",
      summary:
        "Scientists achieve breakthrough in quantum communication with successful transmission over 1000 kilometers.",
      category: "discovery",
      author: "Quantum Research Lab",
      publishedDate: "2024-10-06",
      readTime: "7 min read",
      views: 28900,
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
      tags: ["Quantum Internet", "Communication", "Physics", "Technology"],
      trending: true,
    },
  ];

  // Initialize articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setArticles(mockArticles);
        setFilteredArticles(mockArticles);
      } catch (err) {
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Filter articles based on category and search query
  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      const category = categories.find((cat) => cat.id === selectedCategory);
      filtered = articles.filter((article) => {
        return (
          article.category === selectedCategory ||
          category.keywords.some(
            (keyword) =>
              article.title.toLowerCase().includes(keyword) ||
              article.summary.toLowerCase().includes(keyword) ||
              article.tags.some((tag) => tag.toLowerCase().includes(keyword))
          )
        );
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, selectedCategory, searchQuery]);

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format views
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Loading Articles</h3>
                <p className="text-sm text-muted-foreground">
                  Fetching the latest content for you...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Error Loading Articles</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Latest Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest trends, breakthroughs, and insights in
              technology, science, and innovation
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-64 space-y-4">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  const articleCount =
                    category.id === "all"
                      ? articles.length
                      : articles.filter(
                          (article) =>
                            article.category === category.id ||
                            category.keywords.some(
                              (keyword) =>
                                article.title.toLowerCase().includes(keyword) ||
                                article.summary
                                  .toLowerCase()
                                  .includes(keyword) ||
                                article.tags.some((tag) =>
                                  tag.toLowerCase().includes(keyword)
                                )
                            )
                        ).length;

                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div
                          className={`p-1 rounded-full ${
                            isSelected ? "bg-white/20" : category.color
                          }`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${
                              isSelected ? "text-white" : "text-white"
                            }`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {category.label}
                          </div>
                          <div className="text-xs opacity-70">
                            {articleCount} articles
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "AI & Machine Learning",
                    "Quantum Computing",
                    "Electric Vehicles",
                    "Space Exploration",
                  ].map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="mr-2 mb-2"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredArticles.length === 0 ? (
              <Card className="text-center p-12">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No articles found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or selecting a different category.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentArticles.map((article) => {
                    const category = categories.find(
                      (cat) => cat.id === article.category
                    );
                    const IconComponent = category?.icon || Globe;

                    return (
                      <Card
                        key={article.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Article Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4 flex space-x-2">
                            <Badge
                              className={`${
                                category?.color || "bg-gray-500"
                              } text-white`}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {category?.label || "General"}
                            </Badge>
                            {article.trending && (
                              <Badge variant="destructive">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-6">
                          {/* Article Title */}
                          <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>

                          {/* Article Summary */}
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {article.summary}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.tags.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Article Meta */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(article.publishedDate)}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{article.readTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{formatViews(article.views)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Author */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              By {article.author}
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;

                        if (
                          totalPages <= 7 ||
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === 2 || page === totalPages - 1) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
