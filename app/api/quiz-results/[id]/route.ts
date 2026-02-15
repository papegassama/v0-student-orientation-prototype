import { NextRequest, NextResponse } from "next/server"
import { adminDb, verifyIdToken } from "@/lib/firebase-admin"
import { doc, deleteDoc } from "firebase-admin/firestore"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const docRef = doc(adminDb, "users", userId, "quizResults", params.id)
    await deleteDoc(docRef)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting quiz result:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}
