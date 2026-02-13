import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


// 짧은 ID 생성
function generateShortId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { share_type, data, user_id } = body;

    if (!share_type || !data) {
      return NextResponse.json(
        { error: "share_type and data are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const shareId = generateShortId();

    const { error } = await supabase.from("share_links").insert({
      id: shareId,
      user_id: user_id || null,
      share_type,
      data,
    });

    if (error) {
      console.error("Error creating share link:", error);
      return NextResponse.json(
        { error: "Failed to create share link" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amorea.kr";
    const shareUrl = `${baseUrl}/shared/${shareId}`;

    return NextResponse.json({ shareId, shareUrl });
  } catch (error) {
    console.error("Error in share API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
