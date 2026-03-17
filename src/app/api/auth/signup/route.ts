import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, password, inviteCode } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    let coupleId: string | undefined;

    if (inviteCode) {
      const couple = await prisma.couple.findUnique({ where: { inviteCode } });
      if (!couple) {
        return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
      }
      const members = await prisma.user.count({ where: { coupleId: couple.id } });
      if (members >= 2) {
        return NextResponse.json({ error: "This couple already has two members" }, { status: 400 });
      }
      coupleId = couple.id;
    } else {
      const couple = await prisma.couple.create({ data: {} });
      coupleId = couple.id;
    }

    const user = await prisma.user.create({
      data: { email, name, passwordHash, coupleId },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      coupleId: user.coupleId,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
