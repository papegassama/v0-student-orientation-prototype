import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] DELETE quiz-results: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] DELETE quiz-results:", params.id, "for user", user.id)

    const { error } = await supabase
      .from("quiz_results")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] DELETE quiz-results error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] DELETE quiz-results: Successfully deleted")
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] DELETE quiz-results exception:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
