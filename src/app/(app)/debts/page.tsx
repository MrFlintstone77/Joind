"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/hepta";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, DollarSign, TrendingDown, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEMO_DEBTS } from "@/lib/demo-data";

export default function DebtsPage() {
  const [debts, setDebts] = useState(DEMO_DEBTS);
  const [addOpen, setAddOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<typeof DEMO_DEBTS[0] | null>(null);

  const [newName, setNewName] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newMinPayment, setNewMinPayment] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");

  const totalDebt = debts.reduce((s, d) => s + d.currentBalance, 0);
  const totalOriginal = debts.reduce((s, d) => s + d.totalAmount, 0);
  const totalPaidPercent = ((totalOriginal - totalDebt) / totalOriginal) * 100;
  const monthlyPayments = debts.reduce((s, d) => s + d.minimumPayment, 0);

  const handleAddDebt = () => {
    const total = parseFloat(newTotal);
    setDebts((prev) => [
      ...prev,
      {
        id: `d${Date.now()}`,
        name: newName,
        totalAmount: total,
        currentBalance: total,
        interestRate: parseFloat(newRate) || 0,
        minimumPayment: parseFloat(newMinPayment) || 0,
        dueDate: 1,
        assignedTo: "Alex",
        paidThisMonth: 0,
      },
    ]);
    setAddOpen(false);
    setNewName("");
    setNewTotal("");
    setNewRate("");
    setNewMinPayment("");
  };

  const handlePayment = () => {
    if (!selectedDebt) return;
    const amount = parseFloat(payAmount);
    setDebts((prev) =>
      prev.map((d) =>
        d.id === selectedDebt.id
          ? {
              ...d,
              currentBalance: Math.max(d.currentBalance - amount, 0),
              paidThisMonth: d.paidThisMonth + amount,
            }
          : d
      )
    );
    setPayOpen(false);
    setPayAmount("");
    setPayNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Debts</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and pay off your shared debts</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
              <DialogDescription>Track a new debt for your household.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input label="Debt Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Student Loan" />
              <Input label="Total Amount ($)" type="number" value={newTotal} onChange={(e) => setNewTotal(e.target.value)} placeholder="28000" />
              <Input label="Interest Rate (%)" type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="5.5" />
              <Input label="Minimum Payment ($)" type="number" value={newMinPayment} onChange={(e) => setNewMinPayment(e.target.value)} placeholder="320" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDebt} disabled={!newName || !newTotal}>Add Debt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="elevated" className="!py-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Remaining</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="!py-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
              <p className="text-xl font-semibold mt-1">{totalPaidPercent.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="!py-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Payments</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(monthlyPayments)}</p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Debt Cards */}
      <div className="space-y-3">
        {debts.map((debt) => {
          const paidPercent = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100;
          const isPaidOff = debt.currentBalance <= 0;

          return (
            <Card key={debt.id}>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 mt-0.5">
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      backgroundColor: debt.assignedTo === "Alex" ? "var(--hepta-primary-50)" : "var(--hepta-neutral-100)",
                      color: debt.assignedTo === "Alex" ? "var(--hepta-primary-600)" : "var(--hepta-neutral-700)",
                    }}
                  >
                    {debt.assignedTo.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{debt.name}</h3>
                      {isPaidOff && <Badge variant="success">Paid Off</Badge>}
                      {debt.interestRate > 10 && !isPaidOff && (
                        <Badge variant="destructive" className="text-[10px]">{debt.interestRate}% APR</Badge>
                      )}
                    </div>
                    {!isPaidOff && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDebt(debt);
                          setPayOpen(true);
                        }}
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        Pay
                      </Button>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Remaining</p>
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(debt.currentBalance)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Original</p>
                      <p className="text-sm tabular-nums">{formatCurrency(debt.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Min. Payment</p>
                      <p className="text-sm tabular-nums">{formatCurrency(debt.minimumPayment)}/mo</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Paid This Month</p>
                      <p className="text-sm tabular-nums">{formatCurrency(debt.paidThisMonth)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={paidPercent} className="h-1.5" indicatorClassName={isPaidOff ? "bg-success" : ""} />
                    <p className="text-[11px] text-muted-foreground mt-1">{paidPercent.toFixed(1)}% paid off</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              {selectedDebt && `Pay toward ${selectedDebt.name}. Current balance: ${formatCurrency(selectedDebt.currentBalance)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input label="Payment Amount ($)" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="320" />
            <Input label="Note (optional)" value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="March payment" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment} disabled={!payAmount || parseFloat(payAmount) <= 0}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
