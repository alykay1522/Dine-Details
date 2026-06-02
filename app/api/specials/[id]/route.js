import { NextResponse } from "next/server";
import { getSpecial, updateSpecial, deleteSpecial } from "@/utils/specials";

export async function GET(req, { params }) {
    try {
          const special = await getSpecial(params.id);
          return NextResponse.json(special);
    } catch (err) {
          console.error("GET /api/specials/[id] failed:", err);
          return NextResponse.json(
            { error: "Failed to load special" },
            { status: 500 }
                );
    }
}

export async function PUT(req, { params }) {
    try {
          const data = await req.json();
          const updated = await updateSpecial(params.id, data);
          return NextResponse.json(updated);
    } catch (err) {
          console.error("PUT /api/specials/[id] failed:", err);
          return NextResponse.json(
            { error: "Failed to update special" },
            { status: 500 }
                );
    }
}

export async function DELETE(req, { params }) {
    try {
          const deleted = await deleteSpecial(params.id);
          return NextResponse.json({ success: true, deleted });
    } catch (err) {
          console.error("DELETE /api/specials/[id] failed:", err);
          return NextResponse.json(
            { error: "Failed to delete special" },
            { status: 500 }
                );
    }
}
