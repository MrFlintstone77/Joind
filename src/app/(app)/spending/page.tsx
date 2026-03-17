"use client";

import { Card } from "@/components/hepta";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  DEMO_SPENDING_BY_CATEGORY,
  DEMO_MONTHLY_SPENDING,
  DEMO_TRANSACTIONS,
  getCategoryLabel,
} from "@/lib/demo-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function SpendingPage() {
  const totalThisMonth = DEMO_MONTHLY_SPENDING[DEMO_MONTHLY_SPENDING.length - 1].total;
  const alexTotal = DEMO_MONTHLY_SPENDING[DEMO_MONTHLY_SPENDING.length - 1].alex;
  const jordanTotal = DEMO_MONTHLY_SPENDING[DEMO_MONTHLY_SPENDING.length - 1].jordan;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Spending</h1>
        <p className="text-sm text-muted-foreground mt-1">Joint spending breakdown for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">Combined</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(totalThisMonth)}</p>
        </Card>
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">Alex</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(alexTotal)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{((alexTotal / totalThisMonth) * 100).toFixed(0)}% of total</p>
        </Card>
        <Card className="!py-0">
          <p className="text-xs text-muted-foreground">Jordan</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(jordanTotal)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{((jordanTotal / totalThisMonth) * 100).toFixed(0)}% of total</p>
        </Card>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="split">Partner Split</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Pie Chart */}
            <Card className="lg:col-span-2">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMO_SPENDING_BY_CATEGORY}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {DEMO_SPENDING_BY_CATEGORY.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        fontSize: 12,
                      }}
                      formatter={(value) => [formatCurrency(value as number), ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category List */}
            <Card title="Categories" className="lg:col-span-3">
              <div className="space-y-3">
                {DEMO_SPENDING_BY_CATEGORY.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium tabular-nums">{formatCurrency(cat.amount)}</span>
                      <Badge variant="secondary" className="text-[10px] w-12 justify-center">{cat.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <Card title="Monthly Spending Comparison">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_MONTHLY_SPENDING}>
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
                  <Bar dataKey="alex" name="Alex" fill="var(--hepta-primary-500)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jordan" name="Jordan" fill="var(--hepta-primary-200)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="split">
          <Card title="Who Paid What — This Month">
            <div className="space-y-2">
              {DEMO_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant={tx.userName === "Alex" ? "default" : "secondary"} className="text-[10px] w-14 justify-center">
                      {tx.userName}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{tx.merchantName || tx.name}</p>
                      <p className="text-[11px] text-muted-foreground">{getCategoryLabel(tx.category)} &middot; {tx.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatCurrency(tx.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
