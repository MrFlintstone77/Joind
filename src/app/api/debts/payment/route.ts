import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { debtId, amount, note } = await req.json();

    const payment = await prisma.debtPayment.create({
      data: {
        debtId,
        amount,
        note: note || null,
        paidById: session.user.id!,
      },
    });

    await prisma.debt.update({
      where: { id: debtId },
      data: { currentBalance: { decrement: amount } },
    });

    return NextResponse.json({ payment });
  } catch {
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
