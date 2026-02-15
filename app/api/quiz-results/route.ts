import { NextRequest, NextResponse } from "next/server"
import { saveQuizResult, getQuizResults } from "@/lib/auth-supabase"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { answers, recommendations } = body

    const result = await saveQuizResult(user.id, answers, recommendations)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error saving quiz result:", error)
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await getQuizResults(user.id)

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
