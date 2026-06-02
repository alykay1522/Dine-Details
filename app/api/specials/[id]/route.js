import { NextResponse } from "next/server";
import { getSpecials, createSpecial } from "@/utils/specials";

export async function GET() {
  try {
    const specials = await getSpecials();
    return NextResponse.json(specials);
  } catch (err) {
    console.error("GET /api/specials failed:", err);
    return NextResponse.json({ error: "Failed to load specials" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const created = await createSpecial(data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/specials failed:", err);
    return NextResponse.json({ error: "Failed to create special" }, { status: 500 });
  }
}
