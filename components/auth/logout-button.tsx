"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOutAction();
    router.push("/");
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} variant="destructive" className="w-full" disabled={loading}>
      {loading ? "Logging out..." : "Log out"}
    </Button>
  );
}
