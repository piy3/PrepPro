# Resume Analyzer - Testing Guide

## How to Test the Resume Analyzer

### Step 1: Start the Development Server

Make sure your Next.js development server is running:

```bash
cd PrepPro
npm run dev
```

The app should be available at `http://localhost:3000`

### Step 2: Navigate to Resume Analyzer

1. Open your browser and go to `http://localhost:3000`
2. Navigate to the Resume page (typically at `/home/resume`)

### Step 3: Upload a Resume

1. Click on the upload area or drag & drop a PDF resume
2. Wait for the analysis to complete (2-5 seconds)
3. You'll be automatically redirected to the Results tab

### Step 4: Review the Analysis

Check that the following are displayed:

#### ✅ ATS Score Section
- Overall ATS score (0-100) with color coding:
  - Green (80-100): Excellent
  - Yellow (60-79): Good
  - Red (0-59): Needs Improvement
- Visual progress bar

#### ✅ Overall Rating
- Star rating (1-5 stars)
- Rating badge (Outstanding/Good/Average)

#### ✅ ATS Optimization Tips
- Personalized tips based on score
- Blue highlighted section at the top

#### ✅ Section Analysis
- Contact: Score and feedback
- Summary: Score and feedback
- Experience: Score and feedback
- Education: Score and feedback
- Skills: Score and feedback
- (Plus optional sections like Projects, Certifications, Awards)

#### ✅ Strengths
- Green highlighted section
- List of what your resume does well
- Checkmarks for each strength

#### ✅ Keyword Analysis
- Found Keywords (green badges)
- Missing Keywords (red badges)
- Count of each category

#### ✅ Resume Statistics
- Total word count
- Bullet point count
- Keywords found
- Readability score

#### ✅ Improvement Suggestions Tab
- Prioritized list of improvements
- Priority levels (High/Medium/Low)
- Category tags (Critical/Important/Optional)
- Download report button
- Copy keywords button

### Expected Behavior

#### For a Good Resume (Score 70-85):
- **Strengths**: 4-6 items showing what's good
- **Improvements**: 5-8 actionable suggestions
- **Keywords Found**: 10-20 relevant terms
- **Keywords Missing**: 10-30 suggested terms
- **Tips**: Maintenance and optimization advice

#### For a Poor Resume (Score <60):
- **Strengths**: 0-3 items
- **Improvements**: 8-12 critical suggestions
- **Keywords Found**: 0-8 terms
- **Keywords Missing**: 20-40 suggested terms
- **Tips**: Fundamental optimization steps

### Test Cases

#### Test Case 1: Standard Resume
**Input**: A typical 1-2 page resume with basic sections
**Expected**:
- ATS Score: 60-75
- All major sections detected
- Some keywords found
- Reasonable improvements suggested

#### Test Case 2: Optimized Resume
**Input**: Well-formatted resume with keywords and metrics
**Expected**:
- ATS Score: 75-90
- Multiple strengths identified
- Good keyword coverage
- Minor improvement suggestions

#### Test Case 3: Minimal Resume
**Input**: Short resume with limited content
**Expected**:
- ATS Score: 30-50
- Low word count warning
- Many missing keywords
- Critical improvements needed

### Console Logs to Check

Open browser DevTools (F12) and check the Console tab:

```
Starting resume analysis for: [filename.pdf]
PDF Parse Results:
Text Length: [number]
Number of Pages: [number]
Resume Analysis Results: [detailed analysis object]
Analysis completed successfully: {
  atsScore: [number],
  overallRating: [number],
  keywordsFound: [number],
  improvementsCount: [number]
}
```

### Common Issues & Solutions

#### Issue: "Failed to extract text from PDF"
**Solution**: 
- Ensure PDF is not password-protected
- Verify PDF contains selectable text (not scanned image)
- Check file size is under 10MB

#### Issue: ATS Score is 0 or very low
**Solution**:
- This is expected for resumes with minimal content
- Check the improvements list for specific recommendations
- Verify PDF text was extracted correctly (check console)

#### Issue: No keywords found
**Solution**:
- This indicates the resume lacks technical/industry keywords
- Review the "Missing Keywords" section
- Add relevant skills and technologies to your resume

#### Issue: Upload button not responding
**Solution**:
- Check browser console for errors
- Ensure file is PDF format
- Try refreshing the page

### Manual Testing Checklist

- [ ] PDF upload works (drag & drop)
- [ ] PDF upload works (click to browse)
- [ ] File validation rejects non-PDF files
- [ ] File validation rejects files >10MB
- [ ] Loading state shows during analysis
- [ ] Progress bar animates during upload
- [ ] ATS score displays correctly
- [ ] Star rating matches score
- [ ] Color coding is appropriate (green/yellow/red)
- [ ] Section scores display
- [ ] Strengths list shows
- [ ] Improvements list shows
- [ ] Keywords are categorized correctly
- [ ] Statistics display properly
- [ ] Download report button works
- [ ] Copy keywords button works
- [ ] Tab navigation works
- [ ] Error handling works (try invalid file)

### Performance Testing

- **Upload Speed**: Should complete in 1-3 seconds
- **Analysis Speed**: Should complete in 2-5 seconds total
- **UI Responsiveness**: Should remain smooth during analysis
- **File Size Limit**: Max 10MB enforced

### Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### API Testing

You can also test the API directly:

```bash
curl -X POST http://localhost:3000/api/resume/extract \
  -F "file=@/path/to/your/resume.pdf"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "text": "extracted text...",
    "numpages": 1,
    "textLength": 1234,
    "analysis": {
      "atsScore": 75,
      "overallRating": 3.8,
      "strengths": [...],
      "improvements": [...],
      "keywordAnalysis": {...},
      ...
    }
  }
}
```

## Debug Mode

To enable detailed logging, open browser console and run:

```javascript
localStorage.setItem('debug', 'true');
```

Then reload the page. This will show detailed analysis steps.

## Sample Resume for Testing

If you don't have a resume to test, you can create a simple PDF with:
- Contact information (email, phone)
- A summary section
- Work experience with bullet points
- Education section
- Skills section
- Some technical keywords (JavaScript, Python, etc.)

The analyzer should detect these sections and provide appropriate scoring.
