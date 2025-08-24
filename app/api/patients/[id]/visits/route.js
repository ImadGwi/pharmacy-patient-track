import { NextResponse } from "next/server"
import { addVisitToPatient } from "@/lib/data"

export async function POST(request, { params }) {
  try {
    const visitData = await request.json()
    const newVisit = await addVisitToPatient(params.id, visitData)
    return NextResponse.json(newVisit, { status: 201 })
  } catch (error) {
    console.error("Error creating visit:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
