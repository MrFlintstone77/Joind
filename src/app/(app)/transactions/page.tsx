"use client";

import { useState } from "react";
import { Card, Input } from "@/components/hepta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEMO_TRANSACTIONS, getCategoryLabel, getCategoryColor } from "@/lib/demo-data";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState<string>("all");

  const filtered = DEMO_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      !search ||
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryLabel(tx.category).toLowerCase().includes(search.toLowerCase());

    const matchesUser = filterUser === "all" || tx.userName.toLowerCase() === filterUser;

    return matchesSearch && matchesUser;
  });

  const alexTotal = DEMO_TRANSACTIONS.filter((t) => t.userName === "Alex").reduce((s, t) => s + t.amount, 0);
  const jordanTotal = DEMO_TRANSACTIONS.filter((t) => t.userName === "Jordan").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">See who paid for what across all accounts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">All Transactions</p>
          <p className="text-xl font-semibold mt-1">{DEMO_TRANSACTIONS.length}</p>
        </Card>
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">Alex Spent</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(Math.abs(alexTotal))}</p>
        </Card>
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">Jordan Spent</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(Math.abs(jordanTotal))}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!pl-9"
          />
        </div>
        <Tabs value={filterUser} onValueChange={setFilterUser}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="alex">Alex</TabsTrigger>
            <TabsTrigger value="jordan">Jordan</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Transaction List */}
      <Card>
        <div className="divide-y divide-border -my-1">
          {filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className="text-[11px]"
                    style={{
                      backgroundColor: tx.userName === "Alex" ? "var(--hepta-primary-50)" : "var(--hepta-neutral-100)",
                      color: tx.userName === "Alex" ? "var(--hepta-primary-600)" : "var(--hepta-neutral-700)",
                    }}
                  >
                    {tx.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{tx.merchantName || tx.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{tx.date}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                      style={{ borderColor: getCategoryColor(tx.category), color: getCategoryColor(tx.category) }}
                    >
                      {getCategoryLabel(tx.category)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(tx.amount)}</span>
                <p className="text-[11px] text-muted-foreground">{tx.userName}</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No transactions found</p>
        )}
      </Card>
    </div>
  );
}
