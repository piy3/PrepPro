# Resume Analyzer - ATS Score & Analysis

A comprehensive resume analysis tool that provides ATS (Applicant Tracking System) scoring and detailed feedback, similar to resumeworded.

## Features

### 1. **ATS Score (0-100)**
- Comprehensive scoring algorithm that evaluates multiple aspects of your resume
- Weighted scoring based on:
  - Keywords (25%)
  - Formatting (15%)
  - Content Quality (20%)
  - Section Completeness (20%)
  - Contact Information (10%)
  - Quantification (10%)

### 2. **Overall Rating (1-5 Stars)**
- Visual star rating system
- Based on overall ATS compatibility

### 3. **Section Analysis**
Detailed scoring for each resume section:
- Contact Information
- Summary/Objective
- Work Experience
- Education
- Skills
- Projects (optional)
- Certifications (optional)
- Awards (optional)

### 4. **Keyword Analysis**
- **Found Keywords**: Industry-relevant terms detected in your resume
- **Missing Keywords**: Important keywords you should consider adding
- Categories analyzed:
  - Programming languages and frameworks
  - DevOps and cloud technologies
  - Databases
  - Soft skills
  - Development tools

### 5. **Content Quality Assessment**
- Action verb usage detection
- Bullet point analysis
- Writing style evaluation
- Readability scoring

### 6. **Quantification Analysis**
- Detects numbers, percentages, and metrics
- Encourages measurable achievements
- Identifies impact statements

### 7. **Improvement Suggestions**
Prioritized recommendations categorized as:
- **Critical**: Must-fix issues
- **Important**: Significant improvements
- **Optional**: Nice-to-have enhancements

### 8. **ATS Optimization Tips**
Personalized tips based on your score:
- Score ≥80: Optimization maintenance tips
- Score 60-79: Room for improvement guidance
- Score <60: Fundamental optimization steps

### 9. **Resume Statistics**
- Word count
- Bullet point count
- Keywords found
- Readability score

## How It Works

### Backend Analysis (`/src/lib/resumeAnalyzer.js`)

The analyzer uses sophisticated algorithms to evaluate:

1. **Section Detection**: Identifies all major resume sections using pattern matching
2. **Keyword Matching**: Compares resume content against industry-standard keyword database
3. **Formatting Check**: Validates ATS-friendly formatting practices
4. **Content Analysis**: Evaluates writing quality, action verbs, and structure
5. **Contact Validation**: Ensures all critical contact information is present
6. **Quantification**: Measures use of numbers and metrics

### API Endpoint (`/api/resume/extract`)

**POST** endpoint that:
1. Accepts PDF file upload
2. Extracts text using `pdf-parse`
3. Runs comprehensive analysis
4. Returns detailed results with scores and recommendations

### Frontend Components

#### ResumeUpload.jsx
- Drag-and-drop PDF upload
- File validation (PDF only, max 10MB)
- Upload progress tracking

#### AnalysisResults.jsx
- Visual ATS score display with color coding
- Star rating system
- Section-by-section breakdown
- Keyword analysis visualization
- Statistics dashboard

#### ImprovementSuggestions.jsx
- Prioritized improvement list
- Keyword recommendations
- Quick wins section
- Pro tips

## Usage

1. **Upload Resume**
   - Go to Resume Analyzer page
   - Upload your PDF resume (drag & drop or click to browse)
   - Wait for analysis (typically 2-5 seconds)

2. **Review Results**
   - Check your ATS Score
   - Review section scores
   - Examine keyword analysis

3. **Implement Improvements**
   - Follow prioritized suggestions
   - Add missing keywords
   - Improve quantification
   - Enhance formatting

4. **Re-analyze**
   - Upload updated resume
   - Compare scores
   - Track improvements

## Scoring Breakdown

### ATS Score Ranges
- **80-100**: Excellent - Resume is well-optimized for ATS
- **60-79**: Good - Some improvements needed
- **40-59**: Fair - Significant optimization required
- **0-39**: Poor - Major revisions needed

### What Affects Your Score

**Positive Factors:**
- Relevant keywords (especially technical skills)
- Clear section headers
- Action verbs in bullet points
- Quantified achievements
- Complete contact information
- Standard formatting
- Appropriate length (400-800 words ideal)

**Negative Factors:**
- Missing key sections
- Lack of keywords
- No quantification
- Poor formatting
- Excessive special characters
- Too short or too long
- Missing contact details

## Best Practices

1. **Keywords**: Research job descriptions and include relevant keywords naturally
2. **Formatting**: Use standard section headers and clean formatting
3. **Quantification**: Include numbers, percentages, and metrics
4. **Action Verbs**: Start bullet points with strong action verbs
5. **Length**: Aim for 1-2 pages (400-800 words)
6. **Contact**: Include email, phone, and LinkedIn
7. **Customization**: Tailor resume for each job application

## Technical Details

### Dependencies
- `pdf-parse`: Server-side PDF text extraction
- `pdfjs-dist`: Client-side PDF processing (fallback)
- Next.js API Routes: Backend analysis endpoint

### File Structure
```
PrepPro/
├── src/
│   ├── lib/
│   │   └── resumeAnalyzer.js          # Core analysis logic
│   ├── app/
│   │   ├── api/
│   │   │   └── resume/
│   │   │       └── extract/
│   │   │           └── route.js       # API endpoint
│   │   └── home/
│   │       └── resume/
│   │           ├── page.js            # Main resume page
│   │           └── components/
│   │               ├── page.js        # Main component
│   │               ├── ResumeUpload.jsx
│   │               ├── AnalysisResults.jsx
│   │               ├── ImprovementSuggestions.jsx
│   │               └── ResumeHistory.jsx
```

## Future Enhancements

- [ ] AI-powered suggestions using GPT
- [ ] Custom keyword sets for different industries
- [ ] Resume comparison feature
- [ ] Export analysis report as PDF
- [ ] Save analysis history to database
- [ ] Job description matcher
- [ ] Resume templates library
- [ ] Real-time editing with live score updates

## Troubleshooting

### Upload Issues
- Ensure file is PDF format
- Check file size is under 10MB
- Verify PDF is text-selectable (not scanned image)

### Analysis Issues
- If analysis fails, try re-uploading
- Check browser console for errors
- Ensure backend server is running

### Score Questions
- Scores are calculated using weighted algorithms
- Different sections have different impacts
- Industry keywords heavily influence score

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify file meets requirements
3. Review improvement suggestions carefully
4. Consider industry-specific keyword variations
