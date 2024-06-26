"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function Routing() {
  const router = useRouter();
  const path = usePathname();

  // Legacy hash routing
  useEffect(() => {
    if (window.location.hash) {
      router.replace(window.location.hash.slice(1));
    }
  }, [router]);

  useEffect(() => {
    // Close dropdowns on navigation
    const activeEl = document.activeElement as HTMLElement | undefined;
    if (activeEl?.tagName === "A") activeEl.blur();

    // Scroll to top on navigation, Next.js should already do this, but for some reason it doesn't
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);

  return null;
}
