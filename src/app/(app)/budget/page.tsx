"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/hepta";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEMO_BUDGET_GOALS } from "@/lib/demo-data";

export default function BudgetPage() {
  const [goals, setGoals] = useState(DEMO_BUDGET_GOALS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<typeof DEMO_BUDGET_GOALS[0] | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTarget, setFormTarget] = useState("");

  const totalBudget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSpent = goals.reduce((sum, g) => sum + g.currentSpent, 0);
  const overallPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const openCreate = () => {
    setEditingGoal(null);
    setFormName("");
    setFormCategory("");
    setFormTarget("");
    setDialogOpen(true);
  };

  const openEdit = (goal: typeof DEMO_BUDGET_GOALS[0]) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormCategory(goal.category);
    setFormTarget(goal.targetAmount.toString());
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, name: formName, category: formCategory, targetAmount: parseFloat(formTarget) }
            : g
        )
      );
    } else {
      setGoals((prev) => [
        ...prev,
        {
          id: `b${Date.now()}`,
          name: formName,
          category: formCategory,
          targetAmount: parseFloat(formTarget),
          currentSpent: 0,
          period: "monthly",
        },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
          <p className="text-sm text-muted-foreground mt-1">Shared budget goals for the month</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Goal" : "New Budget Goal"}</DialogTitle>
              <DialogDescription>
                Set a spending limit for a category this month.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input label="Goal Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Groceries" />
              <Input label="Category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="e.g. FOOD_AND_DRINK" />
              <Input label="Monthly Limit ($)" type="number" value={formTarget} onChange={(e) => setFormTarget(e.target.value)} placeholder="800" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!formName || !formTarget}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium">Overall Budget</p>
            <p className="text-2xl font-semibold mt-0.5">
              {formatCurrency(totalSpent)} <span className="text-sm font-normal text-muted-foreground">/ {formatCurrency(totalBudget)}</span>
            </p>
          </div>
          <Badge variant={overallPercent > 90 ? "destructive" : overallPercent > 75 ? "warning" : "success"}>
            {overallPercent.toFixed(0)}% used
          </Badge>
        </div>
        <Progress value={Math.min(overallPercent, 100)} className="h-2" />
      </Card>

      {/* Goal Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => {
          const percent = goal.targetAmount > 0 ? (goal.currentSpent / goal.targetAmount) * 100 : 0;
          const isOver = percent > 100;
          const isWarning = percent > 85 && !isOver;

          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{goal.name}</h3>
                    {isOver && (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Over budget
                      </Badge>
                    )}
                    {isWarning && (
                      <Badge variant="warning" className="text-[10px]">Almost there</Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold mt-2">
                    {formatCurrency(goal.currentSpent)}
                    <span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(goal.targetAmount)}</span>
                  </p>
                  <Progress
                    value={Math.min(percent, 100)}
                    className="h-1.5 mt-2"
                    indicatorClassName={isOver ? "bg-destructive" : isWarning ? "bg-warning" : ""}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {formatCurrency(Math.max(goal.targetAmount - goal.currentSpent, 0))} remaining
                  </p>
                </div>
                <div className="flex gap-1 ml-3">
                  <button onClick={() => openEdit(goal)} className="p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
