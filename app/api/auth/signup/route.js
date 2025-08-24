import bcrypt from "bcryptjs"
import { createDoctor } from "@/lib/data"

export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json()

    console.log("[v0] Signup attempt for email:", email)

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("[v0] Password hashed successfully")

    // Create doctor
    const newDoctor = await createDoctor({
      email,
      passwordHash,
      fullName,
      role: "doctor", // All users are doctors now
    })

    console.log("[v0] Doctor created successfully:", newDoctor.id)

    // Return user data without password
    const { passwordHash: _, ...userData } = newDoctor
    return Response.json(userData)
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return Response.json({ message: error.message || "Server error" }, { status: 500 })
  }
}
