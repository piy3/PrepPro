/**
 * Resume Analyzer Utility
 * Provides comprehensive ATS scoring and analysis similar to resumeworded
 */

// Common industry keywords and skills categorized
const KEYWORDS = {
  programming: [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "Swift",
    "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring", "ASP.NET",
  ],
  devOps: [
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitLab", "GitHub Actions",
    "Terraform", "Ansible", "Linux", "Nginx", "Apache",
  ],
  databases: [
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Oracle",
    "GraphQL", "NoSQL",
  ],
  softSkills: [
    "Leadership", "Communication", "Team", "Collaboration", "Problem-solving", "Agile", "Scrum",
    "Project Management", "Critical Thinking", "Analytical",
  ],
  tools: [
    "Git", "Jira", "Confluence", "Slack", "VS Code", "IntelliJ", "Eclipse", "Postman",
    "Figma", "Adobe XD", "Webpack", "Babel",
  ],
};

// Action verbs for strong bullet points
const ACTION_VERBS = [
  "Developed", "Implemented", "Designed", "Led", "Managed", "Created", "Improved", "Optimized",
  "Increased", "Decreased", "Reduced", "Enhanced", "Architected", "Built", "Delivered",
  "Collaborated", "Coordinated", "Established", "Achieved", "Launched", "Automated",
];

// Common ATS-friendly section headers
const SECTION_HEADERS = {
  contact: ["contact", "contact information", "personal information"],
  summary: ["summary", "professional summary", "objective", "profile", "about"],
  experience: ["experience", "work experience", "professional experience", "employment", "work history"],
  education: ["education", "academic background", "qualifications"],
  skills: ["skills", "technical skills", "core competencies", "expertise"],
  projects: ["projects", "key projects", "portfolio"],
  certifications: ["certifications", "certificates", "licenses"],
  awards: ["awards", "achievements", "honors"],
};

/**
 * Main function to analyze resume text
 */
export function analyzeResume(text, fileName = "resume.pdf") {
  const cleanText = text.toLowerCase();
  const lines = text.split('\n').filter(line => line.trim());
  
  // Perform various analyses
  const sections = detectSections(text);
  const keywords = analyzeKeywords(cleanText);
  const formatting = analyzeFormatting(text, lines);
  const content = analyzeContent(text, lines);
  const contactInfo = analyzeContactInfo(text);
  const quantification = analyzeQuantification(lines);
  
  // Calculate individual scores
  const scores = {
    keywords: keywords.score,
    formatting: formatting.score,
    content: content.score,
    sections: sections.score,
    contact: contactInfo.score,
    quantification: quantification.score,
  };
  
  // Calculate overall ATS score (weighted average)
  const atsScore = Math.round(
    scores.keywords * 0.25 +
    scores.formatting * 0.15 +
    scores.content * 0.20 +
    scores.sections * 0.20 +
    scores.contact * 0.10 +
    scores.quantification * 0.10
  );
  
  // Calculate overall rating (1-5)
  const overallRating = Math.min(5, Math.max(1, (atsScore / 20)));
  
  // Compile all improvements
  const allImprovements = [
    ...keywords.improvements,
    ...formatting.improvements,
    ...content.improvements,
    ...sections.improvements,
    ...contactInfo.improvements,
    ...quantification.improvements,
  ];
  
  // Compile all strengths
  const allStrengths = [
    ...keywords.strengths,
    ...formatting.strengths,
    ...content.strengths,
    ...sections.strengths,
    ...contactInfo.strengths,
    ...quantification.strengths,
  ];
  
  return {
    fileName,
    atsScore,
    overallRating: parseFloat(overallRating.toFixed(1)),
    scores,
    strengths: allStrengths.slice(0, 6), // Top 6 strengths
    improvements: allImprovements.slice(0, 8), // Top 8 improvements
    keywordAnalysis: {
      found: keywords.found,
      missing: keywords.missing.slice(0, 10), // Top 10 missing keywords
      density: keywords.density,
    },
    sections: sections.details,
    contactInfo: contactInfo.details,
    quantificationStats: quantification.stats,
    wordCount: text.split(/\s+/).length,
    characterCount: text.length,
    detailedAnalysis: {
      hasActionVerbs: content.hasActionVerbs,
      bulletPointCount: content.bulletPoints,
      avgBulletLength: content.avgBulletLength,
      readabilityScore: content.readabilityScore,
    },
  };
}

/**
 * Detect and score resume sections
 */
function detectSections(text) {
  const lowerText = text.toLowerCase();
  const detected = {};
  const details = {};
  let score = 0;
  const improvements = [];
  const strengths = [];
  
  // Check for each section type
  for (const [sectionType, headers] of Object.entries(SECTION_HEADERS)) {
    const found = headers.some(header => lowerText.includes(header));
    detected[sectionType] = found;
    
    if (found) {
      score += sectionType === 'contact' || sectionType === 'experience' || sectionType === 'education' ? 20 : 10;
      details[sectionType] = {
        score: sectionType === 'contact' || sectionType === 'experience' || sectionType === 'education' ? 90 : 85,
        feedback: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} section detected`,
      };
      strengths.push(`Includes ${sectionType} section`);
    } else {
      details[sectionType] = {
        score: 0,
        feedback: `Missing ${sectionType} section`,
      };
      if (sectionType === 'contact' || sectionType === 'experience' || sectionType === 'education' || sectionType === 'skills') {
        improvements.push(`Add a clear ${sectionType} section to your resume`);
      }
    }
  }
  
  // Cap score at 100
  score = Math.min(100, score);
  
  return { detected, score, details, improvements, strengths };
}

/**
 * Analyze keywords and their presence
 */
function analyzeKeywords(text) {
  const found = [];
  const missing = [];
  let score = 0;
  const improvements = [];
  const strengths = [];
  
  // Flatten all keywords
  const allKeywords = Object.values(KEYWORDS).flat();
  
  // Check each keyword
  allKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  // Calculate keyword density score
  const density = (found.length / allKeywords.length) * 100;
  score = Math.min(100, density * 2); // Scale up to make it meaningful
  
  // Generate feedback
  if (found.length >= 15) {
    strengths.push(`Strong keyword presence (${found.length} relevant terms found)`);
  } else if (found.length >= 8) {
    strengths.push(`Good keyword coverage with ${found.length} relevant terms`);
  } else {
    improvements.push(`Add more industry-relevant keywords (currently only ${found.length} found)`);
  }
  
  if (score < 40) {
    improvements.push("Significantly increase technical keywords for better ATS compatibility");
  } else if (score < 60) {
    improvements.push("Add more relevant keywords from your target job descriptions");
  }
  
  return { found, missing, density, score, improvements, strengths };
}

/**
 * Analyze resume formatting
 */
function analyzeFormatting(text, lines) {
  let score = 100;
  const improvements = [];
  const strengths = [];
  
  // Check for special characters that may confuse ATS
  const specialChars = /[^\w\s@.,\-()\/]/g;
  const specialCharCount = (text.match(specialChars) || []).length;
  
  if (specialCharCount > 20) {
    score -= 20;
    improvements.push("Reduce use of special characters that may confuse ATS systems");
  } else {
    strengths.push("Clean formatting without excessive special characters");
  }
  
  // Check for consistent date formatting
  const datePatterns = text.match(/\d{4}|\d{1,2}\/\d{4}/g) || [];
  if (datePatterns.length >= 2) {
    strengths.push("Contains date information showing timeline");
  } else {
    improvements.push("Add dates to your experience and education for better context");
  }
  
  // Check for bullet points
  const bulletLines = lines.filter(line => 
    line.trim().match(/^[•\-\*]/) || line.trim().match(/^\d+\./)
  );
  
  if (bulletLines.length >= 5) {
    strengths.push("Good use of bullet points for readability");
  } else {
    score -= 15;
    improvements.push("Use bullet points to improve readability and ATS parsing");
  }
  
  // Check resume length (word count)
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    score -= 25;
    improvements.push("Resume appears too short - add more detail about your experience");
  } else if (wordCount > 1000) {
    score -= 10;
    improvements.push("Resume may be too long - consider condensing to 1-2 pages");
  } else {
    strengths.push("Appropriate resume length");
  }
  
  return { score: Math.max(0, score), improvements, strengths };
}

/**
 * Analyze content quality
 */
function analyzeContent(text, lines) {
  let score = 70; // Base score
  const improvements = [];
  const strengths = [];
  
  // Check for action verbs
  const actionVerbCount = ACTION_VERBS.filter(verb => 
    text.toLowerCase().includes(verb.toLowerCase())
  ).length;
  
  let hasActionVerbs = false;
  if (actionVerbCount >= 5) {
    score += 20;
    strengths.push(`Strong use of action verbs (${actionVerbCount} found)`);
    hasActionVerbs = true;
  } else if (actionVerbCount >= 3) {
    score += 10;
    strengths.push("Good use of action verbs");
    hasActionVerbs = true;
  } else {
    score -= 10;
    improvements.push("Use more action verbs to start bullet points (Developed, Implemented, Led, etc.)");
  }
  
  // Count bullet points
  const bulletPoints = lines.filter(line => 
    line.trim().match(/^[•\-\*]/) || line.trim().match(/^\d+\./)
  ).length;
  
  // Average bullet point length
  const bulletLines = lines.filter(line => 
    line.trim().match(/^[•\-\*]/) || line.trim().match(/^\d+\./)
  );
  const avgBulletLength = bulletLines.length > 0
    ? bulletLines.reduce((sum, line) => sum + line.length, 0) / bulletLines.length
    : 0;
  
  if (avgBulletLength > 30 && avgBulletLength < 120) {
    strengths.push("Bullet points are well-balanced in length");
  } else if (avgBulletLength >= 120) {
    improvements.push("Shorten bullet points for better readability (aim for 1-2 lines)");
  }
  
  // Basic readability (simplified)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = sentences.length > 0
    ? text.split(/\s+/).length / sentences.length
    : 0;
  
  const readabilityScore = avgWordsPerSentence < 20 ? 85 : 70;
  
  if (readabilityScore >= 80) {
    strengths.push("Clear and concise writing style");
  }
  
  return {
    score: Math.min(100, score),
    improvements,
    strengths,
    hasActionVerbs,
    bulletPoints,
    avgBulletLength: Math.round(avgBulletLength),
    readabilityScore,
  };
}

/**
 * Analyze contact information
 */
function analyzeContactInfo(text) {
  let score = 0;
  const improvements = [];
  const strengths = [];
  const details = {};
  
  // Check for email
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/;
  if (emailRegex.test(text)) {
    score += 25;
    details.email = true;
    strengths.push("Email address included");
  } else {
    improvements.push("Add a professional email address");
    details.email = false;
  }
  
  // Check for phone number
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phoneRegex.test(text)) {
    score += 25;
    details.phone = true;
    strengths.push("Phone number included");
  } else {
    improvements.push("Add your phone number");
    details.phone = false;
  }
  
  // Check for LinkedIn
  if (text.toLowerCase().includes('linkedin')) {
    score += 20;
    details.linkedin = true;
    strengths.push("LinkedIn profile included");
  } else {
    improvements.push("Add your LinkedIn profile URL");
    details.linkedin = false;
  }
  
  // Check for GitHub (for tech roles)
  if (text.toLowerCase().includes('github')) {
    score += 15;
    details.github = true;
  } else {
    details.github = false;
  }
  
  // Check for location
  const locationKeywords = ['city', 'state', 'country', 'address', 'location'];
  if (locationKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
    score += 15;
    details.location = true;
  } else {
    details.location = false;
  }
  
  return { score: Math.min(100, score), improvements, strengths, details };
}

/**
 * Analyze quantification and metrics
 */
function analyzeQuantification(lines) {
  let score = 50; // Base score
  const improvements = [];
  const strengths = [];
  
  // Look for numbers and percentages
  const numberPattern = /\d+([.,]\d+)?(%|k|K|M|million|billion)?/g;
  const numbersFound = lines.filter(line => numberPattern.test(line)).length;
  
  const stats = {
    numbersFound,
    percentages: (lines.join(' ').match(/\d+%/g) || []).length,
    hasMetrics: numbersFound > 3,
  };
  
  if (numbersFound >= 8) {
    score += 40;
    strengths.push(`Excellent quantification with ${numbersFound} measurable achievements`);
  } else if (numbersFound >= 4) {
    score += 20;
    strengths.push("Good use of numbers to quantify achievements");
  } else if (numbersFound > 0) {
    score += 10;
    improvements.push("Add more quantified achievements (e.g., 'Increased sales by 30%')");
  } else {
    improvements.push("Quantify your achievements with specific numbers and percentages");
  }
  
  // Check for impact words with numbers
  const impactWords = ['increased', 'decreased', 'reduced', 'improved', 'grew', 'saved', 'generated'];
  const impactWithNumbers = impactWords.some(word => {
    const regex = new RegExp(`${word}.*\\d+`, 'i');
    return regex.test(lines.join(' '));
  });
  
  if (impactWithNumbers) {
    strengths.push("Shows measurable impact in achievements");
  } else if (numbersFound > 0) {
    improvements.push("Connect your numbers to impact (e.g., 'Reduced costs by 25%')");
  }
  
  return { score: Math.min(100, score), improvements, strengths, stats };
}

/**
 * Get ATS optimization tips based on score
 */
export function getATSTips(atsScore) {
  if (atsScore >= 80) {
    return [
      "Your resume is well-optimized for ATS systems",
      "Continue tailoring keywords for each job application",
      "Keep the format clean and consistent",
    ];
  } else if (atsScore >= 60) {
    return [
      "Your resume has good ATS compatibility with room for improvement",
      "Focus on adding more relevant keywords",
      "Ensure all important sections are clearly labeled",
    ];
  } else {
    return [
      "Your resume needs significant optimization for ATS",
      "Add industry-relevant keywords throughout",
      "Use clear section headers and standard formatting",
      "Include contact information prominently",
      "Quantify achievements with specific numbers",
    ];
  }
}
