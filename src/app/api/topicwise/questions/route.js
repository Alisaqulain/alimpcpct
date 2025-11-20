import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TopicWiseMCQ from "@/lib/models/TopicWiseMCQ";
import Subscription from "@/lib/models/Subscription";
import User from "@/lib/models/User";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = payload.userId;

    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json({ error: "topicId is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user?.role === "admin") {
      // Admin can see all questions
      const questions = await TopicWiseMCQ.find({ topicId })
        .sort({ order: 1, createdAt: -1 })
        .lean();
      return NextResponse.json({ questions });
    }

    // Use user._id (ObjectId) instead of userId (string) for consistency
    const userObjectId = user._id;

    // Check if user has active subscription
    let subscription = await Subscription.findOne({
      userId: userObjectId,
      type: "all",
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!subscription) {
      subscription = await Subscription.findOne({
        userId: userObjectId,
        status: "active",
        endDate: { $gt: new Date() }
      });
    }

    if (!subscription) {
      return NextResponse.json({ 
        error: "Active subscription required to access questions" 
      }, { status: 403 });
    }

    // User has active subscription, allow access to all topics
    // (Subscription grants access to all topics, similar to admin)
    // Fetch questions for this topic
    const questions = await TopicWiseMCQ.find({ topicId })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch questions' }, { status: 500 });
  }
}

