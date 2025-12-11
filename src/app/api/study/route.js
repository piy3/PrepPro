import { NextResponse } from "next/server";

// Google Books API - Free tier: 1,000 requests/day
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";

// YouTube Data API v3 - Free tier: 10,000 units/day
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

// Helper function to search Google Books
async function searchBooks(query, maxResults = 12) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=relevance${GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Books API error");
    
    const data = await response.json();
    
    return (data.items || []).map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["Unknown Author"],
      description: item.volumeInfo.description?.substring(0, 200) + "..." || "No description available",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                 `https://ui-avatars.com/api/?name=${encodeURIComponent(item.volumeInfo.title)}&background=random&size=128`,
      previewLink: item.volumeInfo.previewLink,
      infoLink: item.volumeInfo.infoLink,
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
      rating: item.volumeInfo.averageRating || 0,
      ratingsCount: item.volumeInfo.ratingsCount || 0,
      type: 'book'
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Helper function to search YouTube videos
async function searchVideos(query, maxResults = 12) {
  try {
    if (!YOUTUBE_API_KEY) {
      return [];
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&order=relevance`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("YouTube API error");
    
    const data = await response.json();
    
    return (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: 'video'
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

// Fallback curated study materials
const fallbackMaterials = {
  books: [
    {
      id: "1",
      title: "Cracking the Coding Interview",
      authors: ["Gayle Laakmann McDowell"],
      description: "189 Programming Questions and Solutions. The must-read book for software engineers preparing for technical interviews.",
      thumbnail: "https://books.google.com/books/content?id=jD8iswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      previewLink: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
      infoLink: "https://www.crackingthecodinginterview.com/",
      publishedDate: "2015",
      pageCount: 687,
      categories: ["Computer Science", "Interview Preparation"],
      rating: 4.5,
      ratingsCount: 1234,
      type: 'book'
    },
    {
      id: "2",
      title: "Introduction to Algorithms",
      authors: ["Thomas H. Cormen", "Charles E. Leiserson"],
      description: "Comprehensive introduction to algorithms, data structures, and their analysis. The definitive computer science reference.",
      thumbnail: "https://mitpress.mit.edu/wp-content/uploads/2021/11/9780262046305.jpg",
      previewLink: "https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition",
      infoLink: "https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition",
      publishedDate: "2022",
      pageCount: 1312,
      categories: ["Algorithms", "Computer Science"],
      rating: 4.7,
      ratingsCount: 890,
      type: 'book'
    },
    {
      id: "3",
      title: "Clean Code",
      authors: ["Robert C. Martin"],
      description: "A Handbook of Agile Software Craftsmanship. Learn to write clean, maintainable, and professional code.",
      thumbnail: "https://m.media-amazon.com/images/I/51E2055ZGUL._SY445_SX342_.jpg",
      previewLink: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
      infoLink: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
      publishedDate: "2008",
      pageCount: 464,
      categories: ["Software Engineering", "Best Practices"],
      rating: 4.6,
      ratingsCount: 2341,
      type: 'book'
    },
    {
      id: "4",
      title: "System Design Interview",
      authors: ["Alex Xu"],
      description: "An Insider's Guide to ace the system design interview. Learn how to design scalable systems.",
      thumbnail: "https://m.media-amazon.com/images/I/41i2yU6P7BL._SY445_SX342_.jpg",
      previewLink: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF",
      infoLink: "https://www.systemdesigninterview.com/",
      publishedDate: "2020",
      pageCount: 280,
      categories: ["System Design", "Interview Preparation"],
      rating: 4.8,
      ratingsCount: 567,
      type: 'book'
    },
    {
      id: "5",
      title: "Designing Data-Intensive Applications",
      authors: ["Martin Kleppmann"],
      description: "The Big Ideas Behind Reliable, Scalable, and Maintainable Systems. Essential reading for backend engineers.",
      thumbnail: "https://m.media-amazon.com/images/I/51ZSpMl1-2L._SY445_SX342_.jpg",
      previewLink: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
      infoLink: "https://dataintensive.net/",
      publishedDate: "2017",
      pageCount: 616,
      categories: ["Distributed Systems", "Databases"],
      rating: 4.9,
      ratingsCount: 1456,
      type: 'book'
    },
    {
      id: "6",
      title: "JavaScript: The Good Parts",
      authors: ["Douglas Crockford"],
      description: "Master the essential features of JavaScript and avoid the pitfalls. A classic for JavaScript developers.",
      thumbnail: "https://m.media-amazon.com/images/I/5130gb-bYPL._SY445_SX342_.jpg",
      previewLink: "https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742",
      infoLink: "https://www.oreilly.com/library/view/javascript-the-good/9780596517748/",
      publishedDate: "2008",
      pageCount: 176,
      categories: ["JavaScript", "Web Development"],
      rating: 4.4,
      ratingsCount: 1789,
      type: 'book'
    },
  ],
  videos: [
    {
      id: "v1",
      title: "Data Structures Full Course - FreeCodeCamp",
      channel: "freeCodeCamp.org",
      description: "Learn data structures and algorithms in this comprehensive course. Perfect for interview preparation.",
      thumbnail: "https://i.ytimg.com/vi/RBSGKlAvoiM/maxresdefault.jpg",
      publishedAt: "2021-01-15",
      videoUrl: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
      type: 'video'
    },
    {
      id: "v2",
      title: "JavaScript Crash Course - Traversy Media",
      channel: "Traversy Media",
      description: "Modern JavaScript from the beginning. Learn all the fundamentals of JavaScript.",
      thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg",
      publishedAt: "2020-06-15",
      videoUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
      type: 'video'
    },
    {
      id: "v3",
      title: "React Full Course - Codevolution",
      channel: "Codevolution",
      description: "Complete React tutorial for beginners. Build modern web applications with React.",
      thumbnail: "https://i.ytimg.com/vi/QFaFIcGhPoM/maxresdefault.jpg",
      publishedAt: "2022-03-20",
      videoUrl: "https://www.youtube.com/watch?v=QFaFIcGhPoM",
      type: 'video'
    },
    {
      id: "v4",
      title: "System Design Fundamentals - ByteByteGo",
      channel: "ByteByteGo",
      description: "Master system design concepts for technical interviews. Learn scalability patterns.",
      thumbnail: "https://i.ytimg.com/vi/i53Gi_K3o7I/maxresdefault.jpg",
      publishedAt: "2022-08-10",
      videoUrl: "https://www.youtube.com/watch?v=i53Gi_K3o7I",
      type: 'video'
    },
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "programming interview preparation";
    const category = searchParams.get("category") || "all";
    const type = searchParams.get("type") || "all"; // all, books, videos

    let books = [];
    let videos = [];

    // Fetch from APIs if keys are available
    if (GOOGLE_BOOKS_API_KEY || !GOOGLE_BOOKS_API_KEY) { // Works without key too
      const bookQuery = category === "all" ? query : `${query} ${category}`;
      books = await searchBooks(bookQuery, 12);
    }

    if (YOUTUBE_API_KEY) {
      const videoQuery = category === "all" ? query : `${query} ${category} tutorial`;
      videos = await searchVideos(videoQuery, 12);
    }

    // Use fallback if no results
    if (books.length === 0) {
      books = fallbackMaterials.books;
    }
    if (videos.length === 0) {
      videos = fallbackMaterials.videos;
    }

    // Filter by type
    let materials = [];
    if (type === "books") {
      materials = books;
    } else if (type === "videos") {
      materials = videos;
    } else {
      materials = [...books, ...videos];
    }

    // Calculate stats
    const stats = {
      totalMaterials: materials.length,
      booksCount: books.length,
      videosCount: videos.length,
      categories: [...new Set(materials.flatMap(m => m.categories || []))].slice(0, 8),
    };

    return NextResponse.json({
      success: true,
      data: {
        materials,
        books,
        videos,
        stats,
        filters: { query, category, type },
        usingFallback: !GOOGLE_BOOKS_API_KEY && !YOUTUBE_API_KEY,
      },
    });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      data: {
        materials: [...fallbackMaterials.books, ...fallbackMaterials.videos],
        books: fallbackMaterials.books,
        videos: fallbackMaterials.videos,
        stats: {
          totalMaterials: fallbackMaterials.books.length + fallbackMaterials.videos.length,
          booksCount: fallbackMaterials.books.length,
          videosCount: fallbackMaterials.videos.length,
          categories: ["Programming", "Algorithms", "System Design", "Web Development"],
        },
        filters: { query: "", category: "all", type: "all" },
        usingFallback: true,
      },
    });
  }
}
