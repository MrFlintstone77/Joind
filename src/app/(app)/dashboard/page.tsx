"use client";

import { Card } from "@/components/hepta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_MONTHLY_SPENDING,
  DEMO_DEBTS,
  getCategoryLabel,
} from "@/lib/demo-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const totalBalance = DEMO_ACCOUNTS.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalDebt = DEMO_DEBTS.reduce((sum, d) => sum + d.currentBalance, 0);
  const thisMonthSpending = DEMO_MONTHLY_SPENDING[DEMO_MONTHLY_SPENDING.length - 1].total;
  const lastMonthSpending = DEMO_MONTHLY_SPENDING[DEMO_MONTHLY_SPENDING.length - 2].total;
  const spendingChange = ((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;

  const stats = [
    {
      label: "Total Balance",
      value: formatCurrency(totalBalance),
      change: "+2.4%",
      trend: "up" as const,
      icon: Wallet,
    },
    {
      label: "This Month",
      value: formatCurrency(thisMonthSpending),
      change: `${spendingChange > 0 ? "+" : ""}${spendingChange.toFixed(1)}%`,
      trend: spendingChange > 0 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
    },
    {
      label: "Total Debt",
      value: formatCurrency(totalDebt),
      change: "-3.1%",
      trend: "down" as const,
      icon: CreditCard,
    },
    {
      label: "Net Worth",
      value: formatCurrency(totalBalance - totalDebt),
      change: "+1.8%",
      trend: "up" as const,
      icon: PiggyBank,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your financial overview at a glance</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="!py-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-success" />
                    )}
                    <span className="text-xs text-success">{stat.change}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Spending Chart */}
        <Card title="Monthly Spending" className="lg:col-span-3">
          <div className="h-[260px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_MONTHLY_SPENDING}>
                <defs>
                  <linearGradient id="colorAlex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--hepta-primary-500)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--hepta-primary-500)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorJordan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--hepta-primary-300)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--hepta-primary-300)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [formatCurrency(value as number), ""]}
                />
                <Area type="monotone" dataKey="alex" name="Alex" stroke="var(--hepta-primary-500)" fill="url(#colorAlex)" strokeWidth={2} />
                <Area type="monotone" dataKey="jordan" name="Jordan" stroke="var(--hepta-primary-300)" fill="url(#colorJordan)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions" className="lg:col-span-2">
          <div className="space-y-3 -mt-1">
            {DEMO_TRANSACTIONS.slice(0, 7).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {tx.userName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-tight">{tx.merchantName || tx.name}</p>
                    <p className="text-[11px] text-muted-foreground">{getCategoryLabel(tx.category)}</p>
                  </div>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Accounts + Debt Progress */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Linked Accounts */}
        <Card title="Linked Accounts">
          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <span className="text-xs font-medium text-muted-foreground">
                      {account.institutionName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-[11px] text-muted-foreground">{account.ownerName} &middot; {account.institutionName}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${account.currentBalance < 0 ? "text-destructive" : ""}`}>
                  {formatCurrency(account.currentBalance)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Debt Overview */}
        <Card title="Debt Progress">
          <div className="space-y-4">
            {DEMO_DEBTS.map((debt) => {
              const paidPercent = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100;
              return (
                <div key={debt.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{debt.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{debt.assignedTo}</Badge>
                    </div>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {formatCurrency(debt.currentBalance)}
                    </span>
                  </div>
                  <Progress value={paidPercent} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground">
                    {paidPercent.toFixed(0)}% paid &middot; {formatCurrency(debt.minimumPayment)}/mo
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
