import { NextResponse } from "next/server"
import { getPatientsData } from "@/lib/data"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const patientsData = await getPatientsData()

    const patient = patientsData[id]
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}
