import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] POST quiz-results: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { answers, recommendations } = body

    console.log("[v0] POST quiz-results: Saving for user", user.id)

    const { data, error } = await supabase
      .from("quiz_results")
      .insert([
        {
          user_id: user.id,
          answers,
          recommendations,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] POST quiz-results error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] POST quiz-results: Successfully saved")
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] POST quiz-results exception:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] GET quiz-results: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] GET quiz-results: Fetching for user", user.id)

    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] GET quiz-results error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] GET quiz-results: Found", data?.length || 0, "results")
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("[v0] GET quiz-results exception:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
