import { Submission as TrainingSubmission } from "@olinfo/training-api";
import clsx from "clsx";

export function Outcome({ submission }: { submission: TrainingSubmission }) {
  if (submission.compilation_outcome === null) {
    return (
      <span className="inline-flex gap-2 align-bottom">
        <span className="loading loading-spinner loading-xs" /> Compilazione in corso
      </span>
    );
  }
  if (submission.compilation_outcome === "fail") {
    return (
      <span className="inline-block rounded-lg bg-error px-2 text-sm text-error-content">
        Compilazione fallita
      </span>
    );
  }
  if (submission.evaluation_outcome === null) {
    return (
      <span className="inline-flex gap-2 align-bottom">
        <span className="loading loading-spinner loading-xs" /> Esecuzione in corso
      </span>
    );
  }

  return <OutcomeScore score={submission.score!} />;
}

export function OutcomeScore({ score, maxScore }: { score: number; maxScore?: number }) {
  const colors = [
    "bg-red-400 text-error-content",
    "bg-orange-400 text-warning-content",
    "bg-yellow-400 text-warning-content",
    "bg-lime-400 text-warning-content",
    "bg-green-400 text-success-content",
  ];

  const color = colors[Math.floor((score / (maxScore ?? 100)) * 4)];

  return (
    <span className={clsx("inline-block rounded-lg px-2 text-sm", color)}>
      {Math.round(score)} {maxScore && <>/ {maxScore}</>}
    </span>
  );
}
