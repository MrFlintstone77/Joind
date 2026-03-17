"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlaidLink, type PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { Button } from "@/components/hepta";
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Welcome", "Connect Bank", "All Set"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Welcome step state
  const inviteCode = "cly8abc123def";
  const [copied, setCopied] = useState(false);

  // Plaid step state
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [connectedBank, setConnectedBank] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createLinkToken = async () => {
    setPlaidLoading(true);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      const data = await res.json();
      setLinkToken(data.link_token);
    } catch (err) {
      console.error("Failed to create link token:", err);
    }
    setPlaidLoading(false);
  };

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      try {
        await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken, metadata }),
        });
        setConnectedBank(metadata.institution?.name || "Your bank");
        setStep(2);
      } catch (err) {
        console.error("Failed to exchange token:", err);
      }
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  });

  const handleConnectBank = async () => {
    if (linkToken && ready) {
      open();
    } else {
      await createLinkToken();
    }
  };

  if (linkToken && ready && !connectedBank) {
    open();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">J</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Joind</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-border"
              )}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 0 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to Joind</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                Manage your finances as a couple. Connect your bank accounts, track spending together, and crush debt as a team.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4 text-left space-y-3">
              <p className="text-sm font-medium">Invite your partner</p>
              <p className="text-xs text-muted-foreground">
                Share this code so your partner can link their account to yours.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono">
                  {inviteCode}
                </code>
                <Button size="icon" variant="outline" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-success">Copied to clipboard!</p>
              )}
            </div>

            <Button className="w-full" onClick={() => setStep(1)}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Connect Bank */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Connect your bank</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                Securely link your bank account through Plaid to start tracking transactions automatically.
              </p>
            </div>

            <div className="rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Bank-level security</p>
                  <p className="text-xs text-muted-foreground">256-bit encryption, read-only access</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Automatic sync</p>
                  <p className="text-xs text-muted-foreground">Transactions update daily</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">10,000+ institutions</p>
                  <p className="text-xs text-muted-foreground">Works with most US banks</p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleConnectBank} disabled={plaidLoading}>
              {plaidLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
              Connect Bank Account
            </Button>

            <button
              onClick={() => setStep(2)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3: All Set */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
              <Sparkles className="h-7 w-7 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">You&apos;re all set!</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                {connectedBank
                  ? `${connectedBank} is connected. Your transactions will sync shortly.`
                  : "You can connect your bank account anytime from Settings."}
              </p>
            </div>

            {connectedBank && (
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3.5 w-3.5 text-success" />
                </div>
                {connectedBank}
              </div>
            )}

            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
