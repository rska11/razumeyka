"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PaymentStatusRefresh({ active }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return undefined;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      router.refresh();
      if (attempts >= 24) window.clearInterval(timer);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [active, router]);

  return null;
}
