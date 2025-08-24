import { NextResponse } from "next/server"
import { createPatient, searchPatients } from "@/lib/data"

export async function POST(request) {
  try {
    const patientData = await request.json()
    const newPatient = await createPatient(patientData)
    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const patients = await searchPatients(query)
    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}
