import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const coupleId = (session.user as { coupleId?: string }).coupleId;

    let userIds: string[] = [userId];
    if (coupleId) {
      const coupleUsers = await prisma.user.findMany({
        where: { coupleId },
        select: { id: true },
      });
      userIds = coupleUsers.map((u) => u.id);
    }

    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId: { in: userIds } },
      include: {
        accounts: true,
        user: { select: { id: true, name: true } },
      },
    });

    const accounts = plaidItems.flatMap((item) =>
      item.accounts.map((account) => ({
        ...account,
        institutionName: item.institutionName,
        ownerName: item.user.name,
        ownerId: item.user.id,
      }))
    );

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
