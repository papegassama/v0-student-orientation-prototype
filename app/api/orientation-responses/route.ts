import { NextRequest, NextResponse } from "next/server"
import { saveOrientationResponse, getOrientationResponses } from "@/lib/auth-supabase"
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
    const { question_id, response_value } = body

    const result = await saveOrientationResponse(user.id, question_id, response_value)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error saving orientation response:", error)
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

    const responses = await getOrientationResponses(user.id)

    return NextResponse.json(responses, { status: 200 })
  } catch (error) {
    console.error("Error fetching orientation responses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
