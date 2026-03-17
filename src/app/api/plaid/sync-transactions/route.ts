import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId: session.user.id },
      include: { accounts: true },
    });

    let totalAdded = 0;

    for (const item of plaidItems) {
      let cursor = item.cursor;
      let hasMore = true;

      while (hasMore) {
        const response = await plaidClient.transactionsSync({
          access_token: item.accessToken,
          cursor: cursor || undefined,
        });

        const { added, modified, removed, next_cursor, has_more } = response.data;

        for (const tx of added) {
          const account = item.accounts.find(
            (a) => a.plaidAccountId === tx.account_id
          );
          if (!account) continue;

          await prisma.transaction.upsert({
            where: { plaidTransactionId: tx.transaction_id },
            update: {
              name: tx.name,
              merchantName: tx.merchant_name,
              amount: tx.amount,
              category: tx.personal_finance_category?.primary || null,
              subcategory: tx.personal_finance_category?.detailed || null,
              date: new Date(tx.date),
              pending: tx.pending,
            },
            create: {
              accountId: account.id,
              plaidTransactionId: tx.transaction_id,
              name: tx.name,
              merchantName: tx.merchant_name,
              amount: tx.amount,
              category: tx.personal_finance_category?.primary || null,
              subcategory: tx.personal_finance_category?.detailed || null,
              date: new Date(tx.date),
              pending: tx.pending,
              userId: session.user.id,
            },
          });
          totalAdded++;
        }

        for (const tx of modified) {
          await prisma.transaction.updateMany({
            where: { plaidTransactionId: tx.transaction_id },
            data: {
              name: tx.name,
              merchantName: tx.merchant_name,
              amount: tx.amount,
              category: tx.personal_finance_category?.primary || null,
              date: new Date(tx.date),
              pending: tx.pending,
            },
          });
        }

        for (const tx of removed) {
          if (tx.transaction_id) {
            await prisma.transaction.deleteMany({
              where: { plaidTransactionId: tx.transaction_id },
            });
          }
        }

        cursor = next_cursor;
        hasMore = has_more;
      }

      await prisma.plaidItem.update({
        where: { id: item.id },
        data: { cursor },
      });
    }

    return NextResponse.json({ success: true, added: totalAdded });
  } catch (error) {
    console.error("Transaction sync error:", error);
    return NextResponse.json({ error: "Failed to sync transactions" }, { status: 500 });
  }
}
