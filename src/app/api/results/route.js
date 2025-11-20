import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Convert answers Map to object if needed
    const answers = body.answers || {};
    
    const result = await Result.create({
      userId: body.userId || 'anonymous',
      examId: body.examId,
      examTitle: body.examTitle,
      examType: body.examType,
      userName: body.userName,
      userMobile: body.userMobile,
      userCity: body.userCity,
      answers: answers,
      sectionStats: body.sectionStats || [],
      totalQuestions: body.totalQuestions || 0,
      totalAnswered: body.totalAnswered || 0,
      totalCorrect: body.totalCorrect || 0,
      totalIncorrect: body.totalIncorrect || 0,
      totalScore: body.totalScore || 0,
      percentage: body.percentage || 0,
      timeTaken: body.timeTaken,
      submittedAt: new Date()
    });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving result:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const results = await Result.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(50);
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

