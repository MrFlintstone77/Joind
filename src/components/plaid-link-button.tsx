"use client";

import { useCallback, useState } from "react";
import { usePlaidLink, type PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { Button } from "@/components/hepta";
import { Building2, Loader2 } from "lucide-react";

interface PlaidLinkButtonProps {
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PlaidLinkButton({ onSuccess, className, children }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createLinkToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      const data = await res.json();
      setLinkToken(data.link_token);
    } catch (err) {
      console.error("Failed to create link token:", err);
    }
    setLoading(false);
  };

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      try {
        await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken, metadata }),
        });
        onSuccess?.();
      } catch (err) {
        console.error("Failed to exchange token:", err);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  });

  const handleClick = async () => {
    if (linkToken && ready) {
      open();
    } else {
      await createLinkToken();
    }
  };

  // Auto-open when token is ready
  if (linkToken && ready) {
    open();
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={loading} className={className}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Building2 className="h-4 w-4" />
      )}
      {children || "Connect Bank"}
    </Button>
  );
}
