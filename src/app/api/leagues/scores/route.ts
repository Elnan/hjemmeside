import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitScoreSchema = z.object({
  leagueId: z.string(),
  gameId: z.string(),
  score: z.number().int(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = submitScoreSchema.parse(body);

    // Check if user is a member of the league
    const membership = await prisma.leagueMember.findUnique({
      where: {
        leagueId_userId: {
          leagueId: validatedData.leagueId,
          userId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a league member" },
        { status: 403 }
      );
    }

    // Check if already submitted a score today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingScore = await prisma.leagueScore.findFirst({
      where: {
        leagueId: validatedData.leagueId,
        userId,
        gameId: validatedData.gameId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingScore) {
      return NextResponse.json(
        { error: "Already submitted score today" },
        { status: 400 }
      );
    }

    // Submit new score
    const score = await prisma.leagueScore.create({
      data: {
        leagueId: validatedData.leagueId,
        userId,
        gameId: validatedData.gameId,
        score: validatedData.score,
      },
    });

    return NextResponse.json(score);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const leagueId = searchParams.get("leagueId");
    const gameId = searchParams.get("gameId");
    const period = searchParams.get("period") || "daily";

    if (!leagueId || !gameId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    if (period === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === "all-time") {
      startDate = new Date(0); // Beginning of time
    }

    const scores = await prisma.leagueScore.findMany({
      where: {
        leagueId,
        gameId,
        date: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [{ score: "desc" }, { date: "asc" }],
    });

    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
