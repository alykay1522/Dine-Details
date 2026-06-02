import { NextResponse } from "next/server";
import { deleteSpecial } from "@/utils/specials";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const result = await deleteSpecial(id);

    return NextResponse.json(
      { success: true, result },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/specials/[id] failed:", err);
    return NextResponse.json(
      { error: "Failed to delete special" },
      { status: 500 }
    );
  }
}
