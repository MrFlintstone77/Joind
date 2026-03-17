"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/hepta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlaidLinkButton } from "@/components/plaid-link-button";
import { Copy, Check, Building2, Trash2, UserPlus } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/lib/demo-data";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const inviteCode = "cly8abc123def";

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and linked banks</p>
      </div>

      {/* Profile */}
      <Card title="Profile">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">AL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Alex Johnson</p>
              <p className="text-sm text-muted-foreground">alex@example.com</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" defaultValue="Alex Johnson" />
            <Input label="Email" type="email" defaultValue="alex@example.com" />
          </div>
          <Button size="sm">Save Changes</Button>
        </div>
      </Card>

      {/* Partner */}
      <Card title="Partner">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm bg-accent text-accent-foreground">JO</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Jordan Smith</p>
                <p className="text-xs text-muted-foreground">jordan@example.com</p>
              </div>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Invite Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono">{inviteCode}</code>
              <Button size="icon" variant="outline" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Share this code with your partner to link their account.
            </p>
          </div>
        </div>
      </Card>

      {/* Linked Accounts */}
      <Card title="Linked Bank Accounts">
        <div className="space-y-3">
          {DEMO_ACCOUNTS.map((account) => (
            <div key={account.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-[11px] text-muted-foreground">{account.institutionName} &middot; {account.ownerName}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}

          <Separator className="my-2" />

          <PlaidLinkButton className="w-full">
            <UserPlus className="h-4 w-4" />
            Connect Another Bank
          </PlaidLinkButton>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-destructive">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data.</p>
          </div>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      </Card>
    </div>
  );
}
