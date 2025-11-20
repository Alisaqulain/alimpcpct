import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exam from "@/lib/models/Exam";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

async function requireAdmin(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return { ok: false, error: "Unauthorized" };
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload.role !== "admin") return { ok: false, error: "Forbidden" };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function GET() {
  await dbConnect();
  const exams = await Exam.find().sort({ createdAt: -1 });
  return NextResponse.json({ exams });
}

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  await dbConnect();
  const data = await req.json();
  const exam = await Exam.create(data);
  return NextResponse.json({ exam });
}


