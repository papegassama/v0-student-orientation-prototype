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
    const { question_id, response_data } = body

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }

    const userResponsesRef = collection(adminDb, "users", userId, "orientationResponses")
    const docRef = await addDoc(userResponsesRef, {
      questionId: question_id,
      responseData: response_data,
      createdAt: Timestamp.now(),
    })

    return NextResponse.json(
      {
        id: docRef.id,
        questionId: question_id,
        responseData: response_data,
        createdAt: Timestamp.now().toDate().toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving orientation response:", error)
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

    const userResponsesRef = collection(adminDb, "users", userId, "orientationResponses")
    const q = query(userResponsesRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    const responses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || doc.data().createdAt,
    }))

    return NextResponse.json(responses, { status: 200 })
  } catch (error) {
    console.error("Error fetching orientation responses:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
