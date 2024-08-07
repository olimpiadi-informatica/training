"use client";

import Link from "next/link";

import { Trans } from "@lingui/macro";
import { DateTime, Menu } from "@olinfo/react-components";
import { type Submission, getSubmissions } from "@olinfo/terry-api";
import useSWR from "swr";

import { H2 } from "~/components/header";
import { OutcomeScore } from "~/components/outcome";
import { useTerryUser, useUser } from "~/components/user";
import { fileLanguageName } from "~/lib/language";

import { Skeleton } from "./skeleton";

type Props = {
  params: { name: string };
};

export default function Page({ params: { name: taskName } }: Props) {
  const trainingUser = useUser()!;
  const user = useTerryUser();
  const task = user?.contest.tasks.find((t) => t.name === taskName);

  const { data: submissions } = useSWR<Submission[], Error, [string, string, string] | undefined>(
    ["terry/submissions", trainingUser.username, taskName],
    ([, ...params]) => getSubmissions(...params),
  );

  if (!task || !submissions) return <Skeleton />;

  return (
    <div>
      <H2 className="mb-2">
        <Trans>Sottoposizioni</Trans>
      </H2>
      <div className="w-full overflow-x-auto max-md:w-screen max-md:-translate-x-4 max-md:px-4">
        <Menu className="grid min-w-fit grid-cols-[auto_auto_1fr_auto]">
          <h3 className="menu-title col-span-4 grid grid-cols-subgrid gap-2">
            <div>
              <Trans>ID</Trans>
            </div>
            <div>
              <Trans>Linguaggio</Trans>
            </div>
            <div>
              <Trans>Data e ora</Trans>
            </div>
            <div className="text-end">
              <Trans>Esito</Trans>
            </div>
          </h3>
          {submissions.toReversed().map((sub) => (
            <li key={sub.id} className="col-span-4 grid grid-cols-subgrid">
              <Link
                href={`/task/terry/${taskName}/submissions/${sub.id}`}
                className="col-span-4 grid grid-cols-subgrid text-nowrap">
                <div className="mr-1">
                  {sub.input.attempt}-{sub.id.split("-")[0]}
                </div>
                <div>{fileLanguageName(sub.source.path)}</div>
                <div>
                  <DateTime date={sub.date} />
                </div>
                <div className="min-w-40 text-end">
                  <OutcomeScore score={sub.score} maxScore={task.max_score} />
                </div>
              </Link>
            </li>
          ))}
          {submissions.length === 0 && (
            <li className="col-span-full p-2 text-center">
              <Trans>Nessuna sottoposizione inviata</Trans>
            </li>
          )}
        </Menu>
      </div>
    </div>
  );
}
