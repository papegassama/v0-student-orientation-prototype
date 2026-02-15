import { NextRequest, NextResponse } from "next/server"
import { sql as getSql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question_id, response_data } = body

    const sql = getSql()
    const result = await sql`
      INSERT INTO orientation_responses (user_id, question_id, response_data, created_at)
      VALUES (${userId}, ${question_id}, ${JSON.stringify(response_data)}, CURRENT_TIMESTAMP)
      RETURNING id, user_id, question_id, response_data, created_at
    `

    return NextResponse.json(
      {
        id: result[0].id,
        userId: result[0].user_id,
        questionId: result[0].question_id,
        responseData: result[0].response_data,
        createdAt: result[0].created_at,
      },
      { status: 201 }
    )
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
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getSql()
    const responses = await sql`
      SELECT id, user_id, question_id, response_data, created_at
      FROM orientation_responses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json(responses, { status: 200 })
  } catch (error) {
    console.error("Error fetching orientation responses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
