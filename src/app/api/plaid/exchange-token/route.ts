import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_token, metadata } = await req.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = exchangeResponse.data;

    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId: session.user.id,
        accessToken: access_token,
        itemId: item_id,
        institutionId: metadata?.institution?.institution_id,
        institutionName: metadata?.institution?.name,
      },
    });

    const accountsResponse = await plaidClient.accountsGet({ access_token });

    for (const account of accountsResponse.data.accounts) {
      await prisma.account.create({
        data: {
          plaidItemId: plaidItem.id,
          plaidAccountId: account.account_id,
          name: account.name,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype || null,
          currentBalance: account.balances.current,
          availableBalance: account.balances.available,
          isoCurrencyCode: account.balances.iso_currency_code || "USD",
        },
      });
    }

    return NextResponse.json({ success: true, itemId: plaidItem.id });
  } catch (error) {
    console.error("Plaid exchange error:", error);
    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
  }
}
