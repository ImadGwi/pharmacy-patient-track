import { NextResponse } from "next/server"
import { addVisitToPatient, updateVisit, deleteVisit } from "@/lib/data"

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

export async function PUT(request, { params }) {
  try {
    const visitData = await request.json()
    const { visitId, questionnaire } = visitData

    if (!visitId) {
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 })
    }

    const updatedVisit = await updateVisit(params.id, visitId, { questionnaire })
    return NextResponse.json(updatedVisit)
  } catch (error) {
    console.error("Error updating visit:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const visitId = searchParams.get("visitId")

    if (!visitId) {
      return NextResponse.json({ error: "Visit ID is required" }, { status: 400 })
    }

    await deleteVisit(params.id, visitId)
    return NextResponse.json({ message: "Visit deleted successfully" })
  } catch (error) {
    console.error("Error deleting visit:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
