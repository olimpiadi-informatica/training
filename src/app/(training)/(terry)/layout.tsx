"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Trans } from "@lingui/macro";
import { type User, getUser } from "@olinfo/terry-api";
import useSWR from "swr";

import { TerryUserProvider, useUser } from "~/components/user";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const trainingUser = useUser();

  const { data: user } = useSWR<User | undefined, Error, [string, string] | undefined>(
    trainingUser && ["terry/user", trainingUser.username],
    ([, username]) => getUser(username),
  );

  if (!trainingUser) {
    router.push(`/login?redirect=${encodeURIComponent(path)}`);
    return <Trans>Reindirizzamento...</Trans>;
  }

  return <TerryUserProvider user={user}>{children}</TerryUserProvider>;
}
