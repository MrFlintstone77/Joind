"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Target,
  ArrowLeftRight,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/spending", label: "Spending", icon: Receipt },
  { href: "/budget", label: "Budget", icon: Target },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/debts", label: "Debts", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function FloatingDock() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 backdrop-blur-xl px-2 py-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center rounded-full p-2.5 transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-1">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
