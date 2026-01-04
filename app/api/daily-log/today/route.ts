import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateDailyLog } from "@/lib/daily-log-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 })
    }

    const dailyLog = await getOrCreateDailyLog(userId)

    return NextResponse.json(dailyLog)
  } catch (error) {
    console.error("[Date: today] Error fetching daily log:", error)
    return NextResponse.json({ error: "Failed to fetch daily log" }, { status: 500 })
  }
}
