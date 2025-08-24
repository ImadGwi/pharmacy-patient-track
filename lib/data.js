import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read JSON file with error handling
async function readJsonFile(filename, defaultValue = []) {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

// Write JSON file with atomic operation
async function writeJsonFile(filename, data) {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  const tempPath = `${filePath}.tmp`

  await fs.writeFile(tempPath, JSON.stringify(data, null, 2))
  await fs.rename(tempPath, filePath)
}

// Doctors management
export async function getDoctors() {
  return await readJsonFile("doctors.json", [])
}

export async function createDoctor(doctorData) {
  const doctors = await getDoctors()

  const existingDoctor = doctors.find((d) => d.email === doctorData.email)
  if (existingDoctor) {
    throw new Error("Email already exists")
  }

  const newDoctor = {
    id: `D-${uuidv4().slice(0, 8)}`,
    ...doctorData,
    createdAt: new Date().toISOString(),
    active: true,
  }
  doctors.push(newDoctor)
  await writeJsonFile("doctors.json", doctors)
  return newDoctor
}

// Patients management
export async function getPatientsIndex() {
  return await readJsonFile("patients_index.json", [])
}

export async function getPatientsData() {
  return await readJsonFile("patients_data.json", {})
}

export async function createPatient(patientData) {
  console.log("[v0] Creating patient with data:", patientData)
  const patientsIndex = await getPatientsIndex()
  const patientsData = await getPatientsData()

  const patientId = `P-${Date.now()}`
  const newPatient = {
    id: patientId,
    general: patientData.general,
    medical: patientData.medical,
    visits: [],
  }

  // Update index
  patientsIndex.push({
    id: patientId,
    name: `${patientData.general.firstName} ${patientData.general.lastName}`,
    phone: patientData.general.phone,
  })

  // Update data
  patientsData[patientId] = newPatient

  console.log("[v0] Saving to files - Index length:", patientsIndex.length)
  console.log("[v0] Saving to files - Data keys:", Object.keys(patientsData))

  await writeJsonFile("patients_index.json", patientsIndex)
  await writeJsonFile("patients_data.json", patientsData)

  console.log("[v0] Patient created successfully:", newPatient)
  return newPatient
}

export async function addVisitToPatient(patientId, visitData) {
  console.log("[v0] Adding visit to patient:", patientId, visitData)
  const patientsData = await getPatientsData()

  if (!patientsData[patientId]) {
    throw new Error("Patient not found")
  }

  const visit = {
    visitId: `V-${Date.now()}`,
    at: new Date().toISOString(),
    ...visitData,
  }

  patientsData[patientId].visits.push(visit)
  console.log("[v0] Saving visit data to file")
  await writeJsonFile("patients_data.json", patientsData)

  console.log("[v0] Visit added successfully:", visit)
  return visit
}

export async function searchPatients(query) {
  const patientsIndex = await getPatientsIndex()
  if (!query) return patientsIndex

  const searchTerm = query.toLowerCase()
  return patientsIndex.filter(
    (patient) => patient.name.toLowerCase().includes(searchTerm) || patient.phone.includes(searchTerm),
  )
}
