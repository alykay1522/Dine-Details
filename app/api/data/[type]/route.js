import { NextResponse } from "next/server";
import { loadData, saveData } from "@/utils/data";

export async function GET(req, { params }) {
  try {
    const data = await loadData(params.type);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/data/${params.type} failed:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to load data" },
      { status: err.message?.startsWith("Invalid type") ? 400 : 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const result = await saveData(params.type, body);
    return NextResponse.json({ ok: true, url: result.secure_url });
  } catch (err) {
    console.error(`POST /api/data/${params.type} failed:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to save data" },
      { status: err.message?.startsWith("Invalid type") ? 400 : 500 }
    );
  }
}
