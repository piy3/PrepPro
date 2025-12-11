# Resume Analyzer - Complete Implementation Guide

## 📋 Overview

The Resume Analyzer is a comprehensive ATS (Applicant Tracking System) scoring tool that analyzes PDF resumes and provides detailed feedback, scoring, and improvement suggestions - similar to resumeworded.com.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  (Next.js Client Component - React)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Upload     │  │   Results    │  │   History    │     │
│  │     Tab      │  │     Tab      │  │     Tab      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTE HANDLER                         │
│           /api/resume/extract (POST)                        │
│                                                              │
│  1. Receive PDF file                                        │
│  2. Extract text using pdf-parse                            │
│  3. Call analyzeResume() utility                            │
│  4. Return analysis results                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               ANALYSIS UTILITY                               │
│          /src/lib/resumeAnalyzer.js                         │
│                                                              │
│  • detectSections()        → Section analysis               │
│  • analyzeKeywords()       → Keyword matching               │
│  • analyzeFormatting()     → Format validation              │
│  • analyzeContent()        → Content quality                │
│  • analyzeContactInfo()    → Contact validation             │
│  • analyzeQuantification() → Metrics detection              │
│                                                              │
│  Returns: Comprehensive analysis object                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA STORAGE                                │
│                                                              │
│  • LocalStorage (Current)  → Client-side history            │
│  • Database (Future)       → Persistent storage             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Workflow

### **Phase 1: File Upload**

```javascript
// User uploads PDF → ResumeUpload.jsx
const handleFileUpload = async (file) => {
  // 1. Validate file
  if (file.type !== "application/pdf") {
    alert("Please upload a PDF file only.");
    return;
  }
  
  // 2. Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size should be less than 10MB.");
    return;
  }
  
  // 3. Pass to parent component
  onFileUpload(file);
}
```

**Implementation:**
- File: `src/app/home/resume/components/ResumeUpload.jsx`
- Features: Drag-and-drop, click to browse, validation
- Visual feedback: Progress bar, loading states

---

### **Phase 2: Server-Side Processing**

```javascript
// Backend API → /api/resume/extract/route.js
export async function POST(request) {
  // 1. Dynamic import pdf-parse (avoid build issues)
  const pdfParse = (await import("pdf-parse")).default;
  
  // 2. Get file from FormData
  const formData = await request.formData();
  const file = formData.get("file");
  
  // 3. Convert to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // 4. Extract text
  const data = await pdfParse(buffer);
  
  // 5. Analyze resume
  const analysis = analyzeResume(data.text, file.name);
  const atsTips = getATSTips(analysis.atsScore);
  
  // 6. Return comprehensive results
  return NextResponse.json({
    success: true,
    data: {
      text: data.text,
      numpages: data.numpages,
      analysis: { ...analysis, atsTips },
    },
  });
}
```

**Implementation:**
- File: `src/app/api/resume/extract/route.js`
- Dependencies: `pdf-parse`, Next.js API Routes
- Error handling: Try-catch with detailed error messages

---

### **Phase 3: Resume Analysis**

```javascript
// Analysis Engine → /src/lib/resumeAnalyzer.js
export function analyzeResume(text, fileName) {
  const cleanText = text.toLowerCase();
  const lines = text.split('\n').filter(line => line.trim());
  
  // Run all analysis modules
  const sections = detectSections(text);
  const keywords = analyzeKeywords(cleanText);
  const formatting = analyzeFormatting(text, lines);
  const content = analyzeContent(text, lines);
  const contactInfo = analyzeContactInfo(text);
  const quantification = analyzeQuantification(lines);
  
  // Calculate weighted ATS score
  const atsScore = Math.round(
    keywords.score * 0.25 +        // 25% weight
    formatting.score * 0.15 +      // 15% weight
    content.score * 0.20 +         // 20% weight
    sections.score * 0.20 +        // 20% weight
    contactInfo.score * 0.10 +     // 10% weight
    quantification.score * 0.10    // 10% weight
  );
  
  // Compile results
  return {
    atsScore,
    overallRating: atsScore / 20,  // Convert to 1-5 scale
    strengths: [...],
    improvements: [...],
    keywordAnalysis: { found: [...], missing: [...] },
    sections: {...},
    // ... more metrics
  };
}
```

**Key Analysis Functions:**

#### **1. Section Detection**
```javascript
function detectSections(text) {
  const SECTION_HEADERS = {
    contact: ["contact", "contact information"],
    summary: ["summary", "professional summary", "objective"],
    experience: ["experience", "work experience"],
    education: ["education", "academic background"],
    skills: ["skills", "technical skills"],
  };
  
  // Check if each section exists
  // Score based on presence of required sections
  // Return feedback for each section
}
```

#### **2. Keyword Analysis**
```javascript
function analyzeKeywords(text) {
  const KEYWORDS = {
    programming: ["JavaScript", "Python", "React", ...],
    devOps: ["Docker", "Kubernetes", "AWS", ...],
    databases: ["SQL", "MongoDB", "PostgreSQL", ...],
  };
  
  // Check which keywords exist
  // Calculate keyword density
  // Return found and missing keywords
}
```

#### **3. Content Quality**
```javascript
function analyzeContent(text, lines) {
  const ACTION_VERBS = ["Developed", "Implemented", "Led", ...];
  
  // Count action verbs
  // Analyze bullet points
  // Check readability
  // Return content quality score
}
```

---

### **Phase 4: State Management**

```javascript
// Main Component → page.js
const [analysisResults, setAnalysisResults] = useState(null);
const [resumeHistory, setResumeHistory] = useState([]);
const [statsData, setStatsData] = useState({
  totalUploads: 0,
  avgScore: 0,
  totalImprovements: 0,
  bestScore: 0,
});

// Load history from localStorage on mount
useEffect(() => {
  const savedHistory = localStorage.getItem("resumeHistory");
  if (savedHistory) {
    setResumeHistory(JSON.parse(savedHistory));
  }
}, []);

// Update stats when data changes
useEffect(() => {
  updateStats();
}, [resumeHistory, analysisResults]);

// Save new analysis to history
const saveToHistory = (analysis, fileName) => {
  const newEntry = {
    id: Date.now(),
    fileName,
    uploadDate: new Date().toISOString().split('T')[0],
    atsScore: analysis.atsScore,
    suggestions: analysis.improvements?.length || 0,
    analysis, // Full analysis for later viewing
  };
  
  const updatedHistory = [newEntry, ...resumeHistory].slice(0, 10);
  setResumeHistory(updatedHistory);
  localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
};
```

**State Flow:**
1. User uploads file
2. API returns analysis
3. Set `analysisResults` state
4. Save to `resumeHistory`
5. Update `statsData` automatically
6. Persist to localStorage
7. Switch to results tab

---

## 📊 Data Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Upload PDF
     ▼
┌─────────────────┐
│ ResumeUpload    │──→ Validate file
│  Component      │──→ Show progress
└────┬────────────┘
     │ 2. handleFileUpload(file)
     ▼
┌─────────────────┐
│   Main Page     │──→ Set loading state
│   Component     │
└────┬────────────┘
     │ 3. analyzeResume(file)
     ▼
┌─────────────────┐
│  API Route      │──→ POST /api/resume/extract
│  /extract       │
└────┬────────────┘
     │ 4. pdf-parse extracts text
     ▼
┌─────────────────┐
│  resumeAnalyzer │──→ detectSections()
│   Utility       │──→ analyzeKeywords()
│                 │──→ analyzeFormatting()
│                 │──→ analyzeContent()
│                 │──→ analyzeContactInfo()
│                 │──→ analyzeQuantification()
└────┬────────────┘
     │ 5. Return analysis object
     ▼
┌─────────────────┐
│  Main Page      │──→ setAnalysisResults()
│  Component      │──→ saveToHistory()
│                 │──→ updateStats()
│                 │──→ Switch to results tab
└────┬────────────┘
     │ 6. Render results
     ▼
┌─────────────────┬─────────────────┐
│ AnalysisResults │ Improvements    │
│   Component     │   Component     │
└─────────────────┴─────────────────┘
```

---

## 🎯 Key Features Implementation

### **1. ATS Scoring Algorithm**

```javascript
// Weighted scoring system
const atsScore = Math.round(
  keywords.score * 0.25 +       // Keywords (25%)
  formatting.score * 0.15 +     // Formatting (15%)
  content.score * 0.20 +        // Content (20%)
  sections.score * 0.20 +       // Sections (20%)
  contactInfo.score * 0.10 +    // Contact (10%)
  quantification.score * 0.10   // Metrics (10%)
);

// Score ranges:
// 80-100: Excellent
// 60-79:  Good
// 40-59:  Fair
// 0-39:   Poor
```

### **2. Real-Time Statistics**

```javascript
const updateStats = () => {
  const allAnalyses = [...resumeHistory];
  
  // Include current analysis
  if (analysisResults) {
    allAnalyses.push({
      atsScore: analysisResults.atsScore,
      suggestions: analysisResults.improvements?.length || 0,
    });
  }
  
  // Calculate aggregate stats
  const avgScore = Math.round(
    allAnalyses.reduce((acc, item) => acc + item.atsScore, 0) / 
    allAnalyses.length
  );
  
  const bestScore = Math.max(...allAnalyses.map(item => item.atsScore));
  
  setStatsData({
    totalUploads: allAnalyses.length,
    avgScore,
    totalImprovements: allAnalyses.reduce(
      (acc, item) => acc + (item.suggestions || 0), 0
    ),
    bestScore,
  });
};
```

### **3. History Management**

```javascript
// Save to localStorage
const saveToHistory = (analysis, fileName) => {
  const newEntry = {
    id: Date.now(),
    fileName,
    uploadDate: new Date().toISOString().split('T')[0],
    atsScore: analysis.atsScore,
    status: "analyzed",
    suggestions: analysis.improvements?.length || 0,
    analysis, // Store complete analysis
  };
  
  const updatedHistory = [newEntry, ...resumeHistory].slice(0, 10);
  setResumeHistory(updatedHistory);
  localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
};

// Load from history
const onResumeSelect = (resume) => {
  if (resume.analysis) {
    setAnalysisResults(resume.analysis);
    setActiveTab("results");
  }
};

// Delete from history
const onDelete = (id) => {
  const updatedHistory = resumeHistory.filter(item => item.id !== id);
  setResumeHistory(updatedHistory);
  localStorage.setItem("resumeHistory", JSON.stringify(updatedHistory));
};
```

---

## 📁 File Structure & Responsibilities

```
PrepPro/
├── src/
│   ├── lib/
│   │   └── resumeAnalyzer.js           # Core analysis logic
│   │       ├── analyzeResume()         # Main analysis function
│   │       ├── detectSections()        # Section detection
│   │       ├── analyzeKeywords()       # Keyword matching
│   │       ├── analyzeFormatting()     # Format checking
│   │       ├── analyzeContent()        # Content quality
│   │       ├── analyzeContactInfo()    # Contact validation
│   │       ├── analyzeQuantification() # Metrics detection
│   │       └── getATSTips()            # Tips generator
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── resume/
│   │   │       └── extract/
│   │   │           └── route.js        # API endpoint
│   │   │               ├── POST()      # Handle uploads
│   │   │               └── pdf-parse   # Text extraction
│   │   │
│   │   └── home/
│   │       └── resume/
│   │           ├── page.js             # Route wrapper
│   │           └── components/
│   │               ├── page.js         # Main component
│   │               │   ├── State management
│   │               │   ├── File upload handling
│   │               │   ├── History management
│   │               │   └── Stats calculation
│   │               │
│   │               ├── ResumeUpload.jsx
│   │               │   ├── Drag & drop
│   │               │   ├── File validation
│   │               │   └── Progress display
│   │               │
│   │               ├── AnalysisResults.jsx
│   │               │   ├── ATS score display
│   │               │   ├── Section breakdown
│   │               │   ├── Keyword analysis
│   │               │   └── Statistics
│   │               │
│   │               ├── ImprovementSuggestions.jsx
│   │               │   ├── Prioritized tips
│   │               │   ├── Quick wins
│   │               │   └── Download report
│   │               │
│   │               └── ResumeHistory.jsx
│   │                   ├── History list
│   │                   ├── View analysis
│   │                   └── Delete entries
│   │
│   └── components/
│       └── ui/                          # Reusable UI components
│           ├── card.jsx
│           ├── button.jsx
│           ├── badge.jsx
│           ├── progress.jsx
│           └── tabs.jsx
```

---

## 🔧 Configuration

### **Next.js Config** (`next.config.mjs`)

```javascript
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle pdf-parse and canvas dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        'pdf-parse': false,
      };
    }

    return config;
  },
  serverExternalPackages: ['pdf-parse'],
};
```

**Why this is needed:**
- `pdf-parse` is server-side only (requires Node.js fs module)
- Prevents client-side bundle from including server dependencies
- Avoids build errors with Node.js-specific modules

---

## 🚀 How to Use

### **Step 1: Upload Resume**
```
1. Navigate to Resume Analyzer page
2. Drag & drop PDF or click to browse
3. File is validated (PDF only, max 10MB)
4. Upload progress shown
```

### **Step 2: Analysis**
```
1. File sent to /api/resume/extract
2. Server extracts text using pdf-parse
3. Text analyzed by resumeAnalyzer utility
4. Results returned to client
5. Analysis saved to history
6. Stats updated automatically
```

### **Step 3: View Results**
```
1. Automatically switch to Results tab
2. See ATS score (0-100)
3. View section breakdown
4. Check keyword analysis
5. Read improvement suggestions
6. Download detailed report
```

### **Step 4: History**
```
1. View all previous analyses
2. Click to reload past results
3. Delete unwanted entries
4. Track improvement over time
```

---

## 💾 Data Persistence

### **Current: LocalStorage**
```javascript
// Save
localStorage.setItem("resumeHistory", JSON.stringify(history));

// Load
const saved = localStorage.getItem("resumeHistory");
const history = saved ? JSON.parse(saved) : [];
```

### **Future: Database Integration**
```javascript
// Save to database
await fetch('/api/resume/history', {
  method: 'POST',
  body: JSON.stringify(newEntry),
});

// Load from database
const response = await fetch('/api/resume/history');
const history = await response.json();
```

---

## 🎨 UI Components Breakdown

### **Dashboard Stats**
- **Total Uploads**: Count of all analyses
- **Avg ATS Score**: Average of all scores
- **Total Improvements**: Sum of all suggestions
- **Best Score**: Highest ATS score achieved

### **Analysis Results**
- **ATS Score Card**: Visual score with color coding
- **Overall Rating**: 1-5 star rating
- **ATS Tips**: Personalized recommendations
- **Section Analysis**: Per-section scores and feedback
- **Strengths**: What the resume does well
- **Keyword Analysis**: Found vs missing keywords
- **Statistics**: Word count, bullets, readability

### **Improvements**
- **Prioritized List**: High/Medium/Low priority
- **Quick Wins**: Easy improvements
- **Pro Tips**: Expert advice
- **Keyword Recommendations**: Missing keywords to add

---

## 🔍 Error Handling

```javascript
// Frontend
try {
  const analysis = await analyzeResume(file);
  setAnalysisResults(analysis);
} catch (error) {
  console.error("Error:", error);
  alert(error.message || "Failed to process resume");
}

// Backend
try {
  const data = await pdfParse(buffer);
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "Failed to extract text", details: error.message },
    { status: 500 }
  );
}
```

---

## 🎯 Key Takeaways

1. **No Hardcoded Data**: All stats calculated from actual analyses
2. **Real-Time Updates**: Stats update automatically when data changes
3. **Persistent Storage**: History saved to localStorage (can migrate to DB)
4. **Comprehensive Analysis**: 6 different scoring dimensions
5. **User-Friendly**: Clear visual feedback and actionable suggestions
6. **Scalable**: Easy to add new analysis features
7. **Type-Safe**: Proper error handling throughout

---

## 📈 Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication for personal history
- [ ] AI-powered suggestions using GPT
- [ ] Job description matcher
- [ ] Resume templates library
- [ ] Export analysis as PDF
- [ ] Real-time editing with live scoring
- [ ] Industry-specific keyword sets
- [ ] Comparison with top resumes
