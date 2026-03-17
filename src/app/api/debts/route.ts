import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupleId = (session.user as { coupleId?: string }).coupleId;
    if (!coupleId) return NextResponse.json({ debts: [] });

    const debts = await prisma.debt.findMany({
      where: { coupleId },
      include: { payments: { orderBy: { date: "desc" }, take: 5 } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ debts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch debts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const coupleId = (session.user as { coupleId?: string }).coupleId;
    if (!coupleId) return NextResponse.json({ error: "No couple linked" }, { status: 400 });

    const { name, totalAmount, currentBalance, interestRate, minimumPayment, dueDate, assignedToUserId } = await req.json();

    const debt = await prisma.debt.create({
      data: {
        coupleId,
        name,
        totalAmount,
        currentBalance: currentBalance ?? totalAmount,
        interestRate: interestRate ?? 0,
        minimumPayment: minimumPayment ?? 0,
        dueDate: dueDate ?? null,
        assignedToUserId: assignedToUserId ?? null,
      },
    });

    return NextResponse.json({ debt });
  } catch {
    return NextResponse.json({ error: "Failed to create debt" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, ...data } = await req.json();
    const debt = await prisma.debt.update({ where: { id }, data });

    return NextResponse.json({ debt });
  } catch {
    return NextResponse.json({ error: "Failed to update debt" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await prisma.debt.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete debt" }, { status: 500 });
  }
}
