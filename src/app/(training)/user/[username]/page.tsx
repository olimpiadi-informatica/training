"use client";

import Link from "next/link";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Avatar, Card, CardBody } from "@olinfo/react-components";
import { AccessLevel, type User, getUser } from "@olinfo/training-api";
import clsx from "clsx";
import { orderBy } from "lodash-es";
import useSWR from "swr";

import { H1 } from "~/components/header";
import { useUser } from "~/components/user";

import { Skeleton } from "./skeleton";

type Props = {
  params: { username: string };
};

export default function Page({ params: { username } }: Props) {
  const { _ } = useLingui();

  const { data: user } = useSWR<User, Error, [string, string]>(
    ["api/user", username],
    ([, ...params]) => getUser(...params),
  );

  const me = useUser();

  if (!user) return <Skeleton username={username} />;

  return (
    <div className="flex flex-col gap-4">
      <H1 className="sr-only">
        <Trans>Profilo di {username}</Trans>
      </H1>
      <Card>
        <Avatar user={user} size={256} className="max-sm:mx-auto max-sm:p-4" />
        <CardBody
          title={
            <>
              {user.username} <UserBadge level={user.access_level} />
            </>
          }>
          <div>
            {user.first_name} {user.last_name}
          </div>
          {user.institute && (
            <div className="text-sm text-base-content/80">
              {user.institute.name}, {user.institute.city}, {user.institute.region}
            </div>
          )}
          <div className="text-xl font-bold">
            <Trans>{user.score} punti</Trans>
          </div>
          {me?.username === user.username && (
            <div className="mt-auto">
              <Link href={`/user/${user.username}/edit/password`} className="link link-info">
                <Trans>Modifica profilo</Trans>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody title={_(msg`Problemi risolti`)}>
          <div className="sm:columns-2 md:columns-3 lg:columns-4">
            {orderBy(user.scores, ["score", "title"], ["desc", "asc"]).map((task) => (
              <TaskBadge key={task.name} {...task} />
            ))}
            {user.scores?.length === 0 && _(msg`Nessun problema risolto`)}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function UserBadge({ level }: { level: AccessLevel }) {
  switch (level) {
    case AccessLevel.Admin:
      return (
        <span className="badge badge-error">
          <Trans>Admin</Trans>
        </span>
      );
    case AccessLevel.Monica:
      return <span className="badge badge-secondary">Monica</span>;
    case AccessLevel.Tutor:
      return (
        <span className="badge badge-accent">
          <Trans>Tutor</Trans>
        </span>
      );
    case AccessLevel.Teacher:
      return (
        <span className="badge badge-primary">
          <Trans>Insegnante</Trans>
        </span>
      );
    case AccessLevel.Superuser:
      return (
        <span className="badge badge-success">
          <Trans>Aristocratico</Trans>
        </span>
      );
    case AccessLevel.User:
      return (
        <span className="badge badge-info">
          <Trans>Anziano</Trans>
        </span>
      );
    case AccessLevel.Newbie:
      return (
        <span className="badge badge-info">
          <Trans>Novizio</Trans>
        </span>
      );
    case AccessLevel.Guest:
      return (
        <span className="badge badge-info">
          <Trans>Ospite</Trans>
        </span>
      );
  }
}

function TaskBadge({ name, title, score }: { name: string; title: string; score: number }) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const scoreFraction = Math.min(Math.max(score / 100, 0), 1);
  const color = colors[Math.floor(scoreFraction * 4)];

  return (
    <div className="my-1 inline-block w-full">
      <Link
        href={`/task/${name}`}
        className={clsx("inline-block rounded-lg px-2 py-0.5 text-sm", color)}>
        {title} <span className="align-text-bottom text-xs">({Math.round(score)})</span>
      </Link>
    </div>
  );
}
