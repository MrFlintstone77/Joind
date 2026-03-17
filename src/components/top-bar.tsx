"use client";

import Link from "next/link";
import { LogOut, User, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface TopBarProps {
  userName?: string;
  partnerName?: string;
  inviteCode?: string;
}

export function TopBar({ userName = "You", partnerName, inviteCode }: TopBarProps) {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">J</span>
        </div>
        <span className="text-base font-semibold tracking-tight">Joind</span>
      </Link>

      <div className="flex items-center gap-3">
        {!partnerName && inviteCode && (
          <button
            onClick={copyInvite}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Invite partner"}
          </button>
        )}

        <div className="flex items-center -space-x-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none">
                <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                  <AvatarFallback className="text-[11px] bg-primary/10 text-primary">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {partnerName && (
            <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
              <AvatarFallback className="text-[11px] bg-accent text-accent-foreground">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}
