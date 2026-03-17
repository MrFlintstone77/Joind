import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupleId = (session.user as { coupleId?: string }).coupleId;
    if (!coupleId) return NextResponse.json({ goals: [] });

    const goals = await prisma.budgetGoal.findMany({
      where: { coupleId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch {
    return NextResponse.json({ error: "Failed to fetch budget goals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupleId = (session.user as { coupleId?: string }).coupleId;
    if (!coupleId) return NextResponse.json({ error: "No couple linked" }, { status: 400 });

    const { name, category, targetAmount, period } = await req.json();

    const goal = await prisma.budgetGoal.create({
      data: { coupleId, name, category, targetAmount, period: period || "monthly" },
    });

    return NextResponse.json({ goal });
  } catch {
    return NextResponse.json({ error: "Failed to create budget goal" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, ...data } = await req.json();

    const goal = await prisma.budgetGoal.update({ where: { id }, data });
    return NextResponse.json({ goal });
  } catch {
    return NextResponse.json({ error: "Failed to update budget goal" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await prisma.budgetGoal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete budget goal" }, { status: 500 });
  }
}
