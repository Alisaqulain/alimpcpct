import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Referral from "@/lib/models/Referral";
import Subscription from "@/lib/models/Subscription";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    await dbConnect();
    const { referralCode, subscriptionId } = await request.json();

    if (!referralCode || !subscriptionId) {
      return NextResponse.json({ error: "Referral code and subscription ID are required" }, { status: 400 });
    }

    // Find referrer
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const currentUser = await User.findById(payload.userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already used
    if (currentUser.referredBy) {
      return NextResponse.json({ error: "Referral code already used" }, { status: 400 });
    }

    // Get subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Update referred user - add 1 month to subscription
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(Math.max(new Date(subscription.endDate).getTime(), Date.now()) + oneMonthInMs);
    subscription.endDate = newEndDate;
    await subscription.save();

    // Update referrer - add 1 month to their subscription
    // First check for "all" type subscription, then check for same type
    let referrerSubscription = await Subscription.findOne({
      userId: referrer._id,
      type: "all",
      status: "active",
      endDate: { $gt: new Date() }
    });

    if (!referrerSubscription) {
      referrerSubscription = await Subscription.findOne({
        userId: referrer._id,
        type: subscription.type,
        status: "active",
        endDate: { $gt: new Date() }
      });
    }

    if (referrerSubscription) {
      const referrerNewEndDate = new Date(Math.max(new Date(referrerSubscription.endDate).getTime(), Date.now()) + oneMonthInMs);
      referrerSubscription.endDate = referrerNewEndDate;
      await referrerSubscription.save();
    } else {
      // Create new subscription for referrer if they don't have one
      // Use "all" type to match the unified subscription model
      const referrerEndDate = new Date();
      referrerEndDate.setDate(referrerEndDate.getDate() + 30);
      await Subscription.create({
        userId: referrer._id,
        type: subscription.type === "all" ? "all" : subscription.type,
        status: "active",
        startDate: new Date(),
        endDate: referrerEndDate,
        plan: "referral_reward",
        price: 0,
        paymentId: `REF_${Date.now()}`
      });
    }

    // Update user's referredBy
    currentUser.referredBy = referrer._id;
    await currentUser.save();

    // Create referral record
    await Referral.create({
      referrerId: referrer._id,
      referredUserId: currentUser._id,
      referralCode: referralCode.toUpperCase(),
      status: "completed",
      referrerRewardMonths: 1,
      referredRewardMonths: 1,
      subscriptionId: subscription._id
    });

    // Update referrer's reward count
    referrer.referralRewards = (referrer.referralRewards || 0) + 1;
    await referrer.save();

    return NextResponse.json({ 
      success: true, 
      message: "Referral code applied! Both you and the referrer got 1 month free!"
    });
  } catch (error) {
    console.error("Referral apply error:", error);
    return NextResponse.json({ error: "Failed to apply referral code" }, { status: 500 });
  }
}

