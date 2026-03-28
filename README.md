# Placement Prep

Placement Prep is an all-in-one AI based preparation platform for students getting ready for campus placements and technical interviews.

## Project Idea

The core idea of this project is to bring the full placement journey into one product instead of using separate tools for practice, interview prep, resume review, and job tracking.

Students can:
- practice aptitude and quiz questions by topic,
- prepare for interviews with mock interview support,
- analyze resumes using ATS-style scoring and improvement suggestions,
- discover job openings and study resources,
- read placement-focused articles and learning material.


## Main Modules

- `Aptitude Practice` — topic-wise question practice and performance tracking
- `Quiz` — custom and route-based quizzes with result views
- `Mock Interview` — guided interview flow
- `Resume Analyzer` — PDF upload, ATS-style analysis, and improvement tips
- `Job Openings` — job listing and exploration
- `Study + Articles` — curated learning and preparation content

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- API routes for backend logic

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run production build:

```bash
npm run build
npm run start
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
EMAIL_USER=yourMail@gmail.com
EMAIL_PASS=your-16-digit-password
ADMIN_EMAIL=yourMail@gmail.com
```