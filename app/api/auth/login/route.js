import bcrypt from "bcryptjs"
import { getDoctors } from "@/lib/data"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const doctors = await getDoctors()
    const doctor = doctors.find((d) => d.email === email && d.active)

    if (!doctor) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, doctor.passwordHash)
    if (!isValidPassword) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Return user data without password
    const { passwordHash, ...userData } = doctor
    return Response.json(userData)
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
