import { NextResponse } from "next/server";

// News API Configuration
// Get your free API key from: https://newsapi.org/register
// Free tier: 100 requests/day, 1,000 requests/month
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

// Helper function to fetch articles from NewsAPI
async function fetchNewsArticles(query = "technology", category = "all") {
  if (!NEWS_API_KEY) {
    return null; // Will use fallback data
  }

  try {
    // Determine the endpoint and parameters based on category
    let endpoint = `${NEWS_API_BASE_URL}/everything`;
    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 30,
    });

    // Map categories to search queries
    const categoryQueries = {
      development: "programming OR coding OR software development OR web development",
      algorithms: "algorithm OR data structures OR machine learning OR AI",
      science: "nobel prize OR scientific award OR research breakthrough",
      automobiles: "electric vehicle OR autonomous car OR automotive technology",
      discovery: "scientific discovery OR research findings OR breakthrough",
    };

    if (category !== "all" && categoryQueries[category]) {
      params.set("q", categoryQueries[category]);
    } else if (query) {
      params.set("q", query);
    } else {
      params.set("q", "technology OR programming OR science OR innovation");
    }

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "ok" && data.articles) {
      return data.articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        summary: article.description || article.content?.substring(0, 200) + "..." || "No description available",
        category: determineCategory(article.title + " " + (article.description || "")),
        author: article.author || article.source?.name || "Unknown Author",
        publishedDate: article.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        readTime: calculateReadTime(article.content || article.description || ""),
        views: Math.floor(Math.random() * 50000) + 5000,
        image: article.urlToImage || `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop`,
        tags: extractTags(article.title + " " + (article.description || "")),
        trending: index < 5, // Mark first 5 as trending
        url: article.url,
        source: article.source?.name || "Unknown Source",
      }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return null;
  }
}

// Determine article category based on content
function determineCategory(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.match(/programming|coding|software|web|app|javascript|python|react|development|developer/)) {
    return "development";
  }
  if (lowerText.match(/algorithm|data structure|sorting|search|optimization|machine learning|ai|artificial intelligence/)) {
    return "algorithms";
  }
  if (lowerText.match(/nobel|award|prize|science|research|breakthrough|discovery|innovation/)) {
    return "science";
  }
  if (lowerText.match(/car|automobile|vehicle|electric|tesla|autonomous|automotive|transport/)) {
    return "automobiles";
  }
  if (lowerText.match(/discovery|research|study|findings|experiment|technology/)) {
    return "discovery";
  }

  return "development"; // Default category
}

// Extract relevant tags from text
function extractTags(text) {
  const lowerText = text.toLowerCase();
  const possibleTags = [
    "AI", "Machine Learning", "Programming", "Python", "JavaScript", "React",
    "Web Development", "Mobile", "Cloud", "DevOps", "Security", "Blockchain",
    "Quantum Computing", "5G", "IoT", "AR/VR", "Data Science", "Big Data",
    "Cybersecurity", "Automation", "Robotics", "Neural Networks", "Deep Learning",
    "Natural Language Processing", "Computer Vision", "Edge Computing",
    "Serverless", "Microservices", "Docker", "Kubernetes", "AWS", "Azure",
    "Tesla", "Electric Vehicles", "Autonomous Vehicles", "Space", "NASA",
    "Climate Tech", "Green Energy", "Sustainability", "Biotechnology", "CRISPR"
  ];

  const foundTags = possibleTags.filter(tag =>
    lowerText.includes(tag.toLowerCase())
  );

  // Return up to 4 tags, or default tags if none found
  return foundTags.length > 0
    ? foundTags.slice(0, 4)
    : ["Technology", "Innovation", "News", "Trending"];
}

// Calculate estimated read time
function calculateReadTime(content) {
  if (!content) return "5 min read";
  
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
}

// High-quality fallback articles
function getFallbackArticles() {
  return [
    {
      id: 1,
      title: "Revolutionary AI Algorithm Breaks Speed Records in Data Processing",
      summary: "Researchers develop a new machine learning algorithm that processes big data 10x faster than traditional methods, utilizing advanced neural network architectures and parallel processing techniques.",
      category: "algorithms",
      author: "Dr. Sarah Chen",
      publishedDate: "2024-12-10",
      readTime: "5 min read",
      views: 12500,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
      tags: ["AI", "Machine Learning", "Big Data", "Performance"],
      trending: true,
      source: "Tech Research Journal",
      url: "https://www.nature.com/articles/s41586-024-07998-6",
    },
    {
      id: 2,
      title: "Nobel Prize 2024: Groundbreaking Work in Quantum Computing",
      summary: "This year's physics Nobel Prize recognizes pioneering research in quantum error correction and fault-tolerant quantum computers, bringing us closer to practical quantum computing.",
      category: "science",
      author: "Physics Committee",
      publishedDate: "2024-12-09",
      readTime: "8 min read",
      views: 25600,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop",
      tags: ["Nobel Prize", "Quantum Computing", "Physics", "Research"],
      trending: true,
      source: "Nobel Foundation",
      url: "https://www.nobelprize.org/prizes/physics/2024/summary/",
    },
    {
      id: 3,
      title: "Next.js 15 Released: Revolutionary App Router Improvements",
      summary: "The latest Next.js update brings significant performance improvements and new developer experience features including enhanced server components and streaming.",
      category: "development",
      author: "Vercel Team",
      publishedDate: "2024-12-08",
      readTime: "6 min read",
      views: 18900,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
      tags: ["Next.js", "React", "Web Development", "Performance"],
      trending: false,
      source: "Vercel Blog",
      url: "https://nextjs.org/blog/next-15",
    },
    {
      id: 4,
      title: "Tesla's New Battery Technology Doubles Electric Vehicle Range",
      summary: "Revolutionary solid-state battery technology promises to transform the electric vehicle industry with unprecedented range and charging speed, potentially reaching 1000km on a single charge.",
      category: "automobiles",
      author: "Auto Tech Weekly",
      publishedDate: "2024-12-07",
      readTime: "7 min read",
      views: 31200,
      image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=300&fit=crop",
      tags: ["Tesla", "Electric Vehicles", "Battery", "Innovation"],
      trending: true,
      source: "Auto Tech Weekly",
      url: "https://www.tesla.com/blog/advancing-battery-technology",
    },
    {
      id: 5,
      title: "Scientists Discover New Exoplanet with Potential for Life",
      summary: "Astronomers have identified a potentially habitable exoplanet in the Goldilocks zone of a nearby star system, showing signs of water vapor in its atmosphere.",
      category: "discovery",
      author: "NASA Research Team",
      publishedDate: "2024-12-06",
      readTime: "9 min read",
      views: 42100,
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop",
      tags: ["Space", "Exoplanet", "Astronomy", "Life"],
      trending: true,
      source: "NASA",
      url: "https://exoplanets.nasa.gov/",
    },
    {
      id: 6,
      title: "Advanced Graph Algorithms for Social Network Analysis",
      summary: "New algorithmic approaches for analyzing complex social networks and predicting user behavior patterns using cutting-edge graph theory and machine learning.",
      category: "algorithms",
      author: "Dr. Michael Rodriguez",
      publishedDate: "2024-12-05",
      readTime: "12 min read",
      views: 8700,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
      tags: ["Graph Theory", "Social Networks", "Data Analysis", "Algorithms"],
      trending: false,
      source: "Algorithm Review",
      url: "https://dl.acm.org/doi/10.1145/3580305",
    },
    {
      id: 7,
      title: "Breakthrough in Gene Therapy Wins Medical Research Award",
      summary: "Revolutionary CRISPR-based treatment for genetic disorders receives prestigious international recognition, showing 95% success rate in clinical trials.",
      category: "science",
      author: "Medical Research Foundation",
      publishedDate: "2024-12-04",
      readTime: "10 min read",
      views: 19800,
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=500&h=300&fit=crop",
      tags: ["Gene Therapy", "CRISPR", "Medical Research", "Award"],
      trending: false,
      source: "Medical Journal",
      url: "https://www.nature.com/subjects/crispr",
    },
    {
      id: 8,
      title: "React 19: Server Components and Concurrent Features",
      summary: "Exploring the latest React features including improved server components and enhanced concurrent rendering capabilities for better user experiences.",
      category: "development",
      author: "React Team",
      publishedDate: "2024-12-03",
      readTime: "11 min read",
      views: 22400,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
      tags: ["React", "Server Components", "JavaScript", "Frontend"],
      trending: false,
      source: "React Blog",
      url: "https://react.dev/blog/2024/12/05/react-19",
    },
    {
      id: 9,
      title: "Autonomous Vehicles: The Future of Urban Transportation",
      summary: "How self-driving cars are reshaping city planning and transportation infrastructure worldwide, with pilot programs showing 40% reduction in traffic congestion.",
      category: "automobiles",
      author: "Urban Tech Institute",
      publishedDate: "2024-12-02",
      readTime: "8 min read",
      views: 15600,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop",
      tags: ["Autonomous Vehicles", "Transportation", "Smart Cities", "Technology"],
      trending: false,
      source: "Urban Tech",
      url: "https://www.wired.com/tag/autonomous-vehicles/",
    },
    {
      id: 10,
      title: "Quantum Internet: First Successful Long-Distance Transmission",
      summary: "Scientists achieve breakthrough in quantum communication with successful transmission over 1000 kilometers, paving the way for ultra-secure global networks.",
      category: "discovery",
      author: "Quantum Research Lab",
      publishedDate: "2024-12-01",
      readTime: "7 min read",
      views: 28900,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
      tags: ["Quantum Internet", "Communication", "Physics", "Technology"],
      trending: true,
      source: "Science Daily",
      url: "https://www.sciencedaily.com/news/matter_energy/quantum_computing/",
    },
    {
      id: 11,
      title: "Python 3.13 Released with Performance Enhancements",
      summary: "Latest Python release features significant speed improvements, better memory management, and enhanced type hinting capabilities for modern development.",
      category: "development",
      author: "Python Software Foundation",
      publishedDate: "2024-11-30",
      readTime: "6 min read",
      views: 16800,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop",
      tags: ["Python", "Programming", "Performance", "Release"],
      trending: false,
      source: "Python.org",
      url: "https://www.python.org/downloads/release/python-3130/",
    },
    {
      id: 12,
      title: "Breakthroughs in Fusion Energy Research",
      summary: "Scientists achieve net positive energy output in fusion reaction for the third consecutive time, bringing clean unlimited energy closer to reality.",
      category: "discovery",
      author: "National Ignition Facility",
      publishedDate: "2024-11-29",
      readTime: "9 min read",
      views: 35200,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=300&fit=crop",
      tags: ["Fusion Energy", "Clean Energy", "Physics", "Innovation"],
      trending: true,
      source: "Energy News",
      url: "https://www.llnl.gov/news/national-ignition-facility-achieves-fusion-ignition",
    },
  ];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "all";

    // Try to fetch from NewsAPI first
    let articles = await fetchNewsArticles(query, category);

    // Use fallback if API fails or no API key
    if (!articles || articles.length === 0) {
      articles = getFallbackArticles();

      // Filter fallback articles by category if specified
      if (category !== "all") {
        articles = articles.filter((article) => article.category === category);
      }

      // Filter by search query if specified
      if (query) {
        const lowerQuery = query.toLowerCase();
        articles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.summary.toLowerCase().includes(lowerQuery) ||
            article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      }
    }

    // Calculate stats
    const stats = {
      totalArticles: articles.length,
      trendingCount: articles.filter((a) => a.trending).length,
      categories: [...new Set(articles.map((a) => a.category))],
      totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        articles,
        stats,
      },
      source: NEWS_API_KEY ? "NewsAPI" : "Fallback Data",
    });
  } catch (error) {
    console.error("Error in articles API:", error);

    // Return fallback data on error
    const fallbackArticles = getFallbackArticles();
    const stats = {
      totalArticles: fallbackArticles.length,
      trendingCount: fallbackArticles.filter((a) => a.trending).length,
      categories: [...new Set(fallbackArticles.map((a) => a.category))],
      totalViews: fallbackArticles.reduce((sum, a) => sum + a.views, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        articles: fallbackArticles,
        stats,
      },
      source: "Fallback Data (Error Recovery)",
    });
  }
}
