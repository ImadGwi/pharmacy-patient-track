import { NextResponse } from "next/server"
import { getPatientsData, updatePatient, deletePatient } from "@/lib/data"

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

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const patientData = await request.json()

    const updatedPatient = await updatePatient(id, patientData)
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await deletePatient(id)
    return NextResponse.json({ message: "Patient deleted successfully" })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
