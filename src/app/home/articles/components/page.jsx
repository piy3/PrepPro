"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
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
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedArticles");
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  }, []);

  // Handle article click - open in new tab
  const handleArticleClick = (article) => {
    if (article.url) {
      window.open(article.url, "_blank");
    }
  };

  // Handle bookmark toggle
  const handleBookmark = (e, article) => {
    e.stopPropagation();
    const isBookmarked = bookmarkedArticles.some((a) => a.id === article.id);
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarkedArticles.filter((a) => a.id !== article.id);
    } else {
      updatedBookmarks = [...bookmarkedArticles, article];
    }

    setBookmarkedArticles(updatedBookmarks);
    localStorage.setItem("bookmarkedArticles", JSON.stringify(updatedBookmarks));
  };

  // Handle share
  const handleShare = async (e, article) => {
    e.stopPropagation();
    if (navigator.share && article.url) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${article.title}\n${article.url || window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert("Link copied to clipboard!");
    }
  };

  // Check if article is bookmarked
  const isArticleBookmarked = (articleId) => {
    return bookmarkedArticles.some((a) => a.id === articleId);
  };

  // Categories configuration - Technology focused
  const categories = [
    {
      id: "all",
      label: "All Tech",
      icon: Globe,
      color: "bg-blue-500",
      keywords: [],
    },
    {
      id: "development",
      label: "Software Dev",
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
        "developer",
        "node",
        "api",
      ],
    },
    {
      id: "algorithms",
      label: "AI & ML",
      icon: Cpu,
      color: "bg-purple-500",
      keywords: [
        "algorithm",
        "data structure",
        "sorting",
        "search",
        "optimization",
        "machine learning",
        "ai",
        "artificial intelligence",
        "deep learning",
        "neural network",
      ],
    },
    {
      id: "science",
      label: "Tech Innovation",
      icon: Award,
      color: "bg-yellow-500",
      keywords: [
        "innovation",
        "breakthrough",
        "research",
        "technology",
        "computing",
        "digital transformation",
        "tech award",
      ],
    },
    {
      id: "automobiles",
      label: "Auto Tech",
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
        "ev",
        "self-driving",
      ],
    },
    {
      id: "discovery",
      label: "Tech Trends",
      icon: Microscope,
      color: "bg-indigo-500",
      keywords: [
        "discovery",
        "trend",
        "emerging",
        "future",
        "startup",
        "cloud",
        "blockchain",
        "iot",
        "cybersecurity",
      ],
    },
  ];

  // Fetch articles from API - Optimized with useCallback
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/articles", {
        cache: "force-cache",
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success && data.data.articles) {
        setArticles(data.data.articles);
        setFilteredArticles(data.data.articles);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter articles based on category and search query - Optimized
  useEffect(() => {
    let result = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      const category = categories.find((cat) => cat.id === selectedCategory);
      if (category) {
        result = articles.filter((article) => {
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
    }

    // Filter by search query
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(result);
    setCurrentPage(1);
  }, [articles, selectedCategory, searchQuery]);

  // Pagination - Optimized with useMemo
  const { currentArticles, totalPages, indexOfFirstArticle, indexOfLastArticle } = useMemo(() => {
    const lastIndex = currentPage * articlesPerPage;
    const firstIndex = lastIndex - articlesPerPage;
    return {
      currentArticles: filteredArticles.slice(firstIndex, lastIndex),
      totalPages: Math.ceil(filteredArticles.length / articlesPerPage),
      indexOfFirstArticle: firstIndex,
      indexOfLastArticle: lastIndex
    };
  }, [filteredArticles, currentPage, articlesPerPage]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Technology Articles</h3>
                <p className="text-sm text-muted-foreground">
                  Fetching the latest tech news and insights...
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-black flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              Latest Technology Articles
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Discover cutting-edge technology trends, programming insights, and innovation breakthroughs
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:gap-4 items-stretch sm:items-center sm:flex-row justify-between">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
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
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Categories - Hidden on mobile */}
          <div className="hidden lg:block lg:w-64 space-y-4">
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
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
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
                  <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "AI & ML", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
                    { label: "Web Dev", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
                    { label: "Cloud Tech", color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
                    { label: "EV Technology", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
                    { label: "Blockchain", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
                    { label: "IoT", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
                  ].map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`${topic.color} cursor-pointer hover:scale-105 transition-transform`}
                      onClick={() => setSearchQuery(topic.label)}
                    >
                      {topic.label}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
                  {currentArticles.map((article) => {
                    const category = categories.find(
                      (cat) => cat.id === article.category
                    );
                    const IconComponent = category?.icon || Globe;

                    return (
                      <Card
                        key={article.id}
                        className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full"
                        onClick={() => handleArticleClick(article)}
                      >
                        {/* Article Image with Gradient Overlay */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop`;
                            }}
                          />
                          {/* Gradient overlay for better badge visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                            <Badge
                              className={`${
                                category?.color || "bg-blue-600"
                              } text-white shadow-lg backdrop-blur-sm bg-opacity-90`}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {category?.label || "General"}
                            </Badge>
                            {article.trending && (
                              <Badge className="bg-red-600 text-white shadow-lg backdrop-blur-sm bg-opacity-90">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>

                          {/* Source badge */}
                          {article.source && (
                            <div className="absolute bottom-3 right-3 z-10">
                              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs shadow-md">
                                {article.source}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-5 flex-1 flex flex-col">
                          {/* Article Title */}
                          <h3 className="text-base font-bold line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight min-h-[3rem]">
                            {article.title}
                          </h3>

                          {/* Article Summary */}
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
                            {article.summary}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800/50">
                                +{article.tags.length - 2}
                              </Badge>
                            )}
                          </div>

                          {/* Article Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">{formatDate(article.publishedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                              <span>{formatViews(article.views)}</span>
                            </div>
                          </div>

                          {/* Author and Actions */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                {article.author?.charAt(0) || 'A'}
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                {article.author}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 w-8 p-0 rounded-full transition-all ${
                                  isArticleBookmarked(article.id)
                                    ? "bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900"
                                    : "hover:bg-blue-50 dark:hover:bg-blue-950"
                                }`}
                                onClick={(e) => handleBookmark(e, article)}
                                title={isArticleBookmarked(article.id) ? "Remove bookmark" : "Bookmark article"}
                              >
                                <Bookmark
                                  className={`h-4 w-4 transition-all ${
                                    isArticleBookmarked(article.id)
                                      ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400 scale-110"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-full hover:bg-green-50 dark:hover:bg-green-950 transition-all"
                                onClick={(e) => handleShare(e, article)}
                                title="Share article"
                              >
                                <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArticleClick(article);
                                }}
                                title="Open article in new tab"
                              >
                                <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
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
                              className={
                                isCurrentPage
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : ""
                              }
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
