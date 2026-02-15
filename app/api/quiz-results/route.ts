import { NextRequest, NextResponse } from "next/server"
import { adminDb, verifyIdToken } from "@/lib/firebase-admin"
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase-admin/firestore"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split("Bearer ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = await verifyIdToken(token)
    const userId = decodedToken.uid

    const body = await request.json()
    const { answers, recommendations } = body

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }

    const userQuizResultsRef = collection(adminDb, "users", userId, "quizResults")
    const docRef = await addDoc(userQuizResultsRef, {
      answers,
      recommendations,
      createdAt: Timestamp.now(),
    })

    return NextResponse.json(
      {
        id: docRef.id,
        answers,
        recommendations,
        createdAt: Timestamp.now().toDate().toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving quiz result:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split("Bearer ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = await verifyIdToken(token)
    const userId = decodedToken.uid

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }

    const userQuizResultsRef = collection(adminDb, "users", userId, "quizResults")
    const q = query(userQuizResultsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || doc.data().createdAt,
    }))

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
