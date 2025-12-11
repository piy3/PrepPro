import { NextRequest, NextResponse } from "next/server";
import { analyzeResume, getATSTips } from "@/lib/resumeAnalyzer";

export async function POST(request) {
  try {
    // Dynamic import of pdf-parse to avoid build-time issues
    const pdfParse = (await import("pdf-parse")).default;
    
    // Get the uploaded file from the form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text using pdf-parse (server-side)
    const data = await pdfParse(buffer);

    console.log("PDF Parse Results:");
    console.log("Text Length:", data.text.length);
    console.log("Number of Pages:", data.numpages);
    console.log("PDF Info:", data.info);

    // Analyze the resume
    const analysis = analyzeResume(data.text, file.name);
    const atsTips = getATSTips(analysis.atsScore);

    return NextResponse.json({
      success: true,
      data: {
        text: data.text,
        numpages: data.numpages,
        textLength: data.text.length,
        info: data.info,
        analysis: {
          ...analysis,
          atsTips,
        },
      },
    });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return NextResponse.json(
      { 
        error: "Failed to extract text from PDF",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
