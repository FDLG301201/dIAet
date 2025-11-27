import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { foodId, tipoComida, consumido } = await request.json()

    if (!foodId || !tipoComida) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, update database here
    console.log("[v0] Marking food:", { foodId, tipoComida, consumido })

    return NextResponse.json({
      success: true,
      foodId,
      consumido,
      horaConsumo: consumido ? new Date() : null,
    })
  } catch (error) {
    console.error("[v0] Error marking food consumed:", error)
    return NextResponse.json({ error: "Failed to update food status" }, { status: 500 })
  }
}
