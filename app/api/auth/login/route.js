import bcrypt from "bcryptjs"
import { getDoctors } from "@/lib/data"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)

    const doctors = await getDoctors()
    console.log("[v0] Found doctors:", doctors.length)

    const doctor = doctors.find((d) => d.email === email && d.active)
    console.log("[v0] Doctor found:", !!doctor)

    if (!doctor) {
      console.log("[v0] No active doctor found with email:", email)
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, doctor.passwordHash)
    console.log("[v0] Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Invalid password for doctor:", email)
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Return user data without password
    const { passwordHash, ...userData } = doctor
    console.log("[v0] Login successful for:", email)
    return Response.json(userData)
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
