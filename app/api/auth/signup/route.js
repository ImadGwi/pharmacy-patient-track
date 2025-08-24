import bcrypt from "bcryptjs"
import { createDoctor } from "@/lib/data"

export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json()

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create doctor
    const newDoctor = await createDoctor({
      email,
      passwordHash,
      fullName,
      role: "doctor", // All users are doctors now
    })

    // Return user data without password
    const { passwordHash: _, ...userData } = newDoctor
    return Response.json(userData)
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
