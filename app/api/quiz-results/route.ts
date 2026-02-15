import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { answers, recommendations } = body

    const result = await sql`
      INSERT INTO quiz_results (user_id, answers, recommendations, created_at)
      VALUES (${userId}, ${JSON.stringify(answers)}, ${JSON.stringify(recommendations)}, CURRENT_TIMESTAMP)
      RETURNING id, user_id, answers, recommendations, created_at
    `

    return NextResponse.json(
      {
        id: result[0].id,
        userId: result[0].user_id,
        answers: result[0].answers,
        recommendations: result[0].recommendations,
        createdAt: result[0].created_at,
      },
      { status: 201 }
    )
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
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await sql`
      SELECT id, user_id, answers, recommendations, created_at
      FROM quiz_results
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
