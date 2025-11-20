import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscription from "@/lib/models/Subscription";
import User from "@/lib/models/User";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ hasAccess: false, reason: "no_token", redirectTo: "/signup" }, { status: 401 });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ hasAccess: false, reason: "invalid_token", redirectTo: "/signup" }, { status: 401 });
    }

    const { type, examType, isFree, itemId } = await request.json();

    await dbConnect();
    
    // Get user to check if they're admin
    const user = await User.findById(decoded.userId);
    if (user?.role === "admin") {
      return NextResponse.json({ hasAccess: true, reason: "admin" });
    }

    // Check if content is marked as free
    if (isFree === true) {
      return NextResponse.json({ hasAccess: true, reason: "free" });
    }

    // Check if user has active subscription
    // First check for "all" type subscription (unified subscription)
    let subscription = await Subscription.findOne({
      userId: decoded.userId,
      type: "all",
      status: "active",
      endDate: { $gt: new Date() }
    });

    // If no unified subscription, check for specific type subscription
    if (!subscription) {
      subscription = await Subscription.findOne({
        userId: decoded.userId,
        type,
        status: "active",
        endDate: { $gt: new Date() }
      });
    }

    if (subscription) {
      return NextResponse.json({ 
        hasAccess: true, 
        reason: "subscription",
        subscription: {
          plan: subscription.plan,
          endDate: subscription.endDate,
          type: subscription.type
        }
      });
    }

    // No subscription and not free - redirect to payment
    return NextResponse.json({ 
      hasAccess: false, 
      reason: "no_subscription",
      redirectTo: `/payment-app?type=${type}&itemId=${itemId || ''}`
    });
  } catch (error) {
    console.error("Access check error:", error);
    return NextResponse.json({ hasAccess: false, reason: "error" }, { status: 500 });
  }
}
