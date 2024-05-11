import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Form, SelectField, SingleFileField, SubmitButton } from "@olinfo/react-components";
import { Task, submitBatch } from "@olinfo/training-api";
import clsx from "clsx";
import { Send, TriangleAlert } from "lucide-react";

import { H2 } from "~/components/header";
import { language } from "~/lib/language";

const Editor = dynamic(() => import("./editor"), {
  loading: () => <div className="skeleton size-full rounded-none" />,
  ssr: false,
});

export function SubmitBatch({ task }: { task: Task }) {
  const router = useRouter();

  const langMessage = (lang?: string) => {
    switch (compilerLang(lang)) {
      case "Pascal":
        return "Probabilmente hai sbagliato a selezionare il linguaggio, in caso contrario ti suggeriamo di smettere di usare Pascal e imparare un linguaggio più moderno.";
      case "Java":
        return `Assicurati di chiamare la tua classe "${task.submission_format[0].replace(".%l", "")}", altrimenti la compilazione non andrà a buon fine.`;
    }
  };

  const validateFile = (file: File) => {
    if (file.size > 100_000) return "File troppo grande";
    if (!task.supported_languages.some((l) => language(file.name) === compilerLang(l))) {
      return "Tipo di file non valido";
    }
  };

  const [editorValue, setEditorValue] = useState<string>();
  const submit = async (value: { lang: string; src: File }) => {
    const sub = await submitBatch(
      task,
      value.lang,
      new File([editorValue ?? ""], value.src?.name ?? "source.txt"),
    );
    router.push(`/task/${task.name}/submissions/${sub.id}`);
    await new Promise(() => {});
  };

  const isSubmitPage = usePathname().endsWith("/submit");

  return (
    <Form
      defaultValue={{ lang: task.supported_languages[0] }}
      onSubmit={submit}
      className="!max-w-full grow">
      <H2>Invia soluzione</H2>
      <div
        className={clsx(
          "mb-4 flex w-full max-w-sm flex-col items-center",
          isSubmitPage && "md:max-w-3xl md:flex-row md:items-start md:gap-4",
        )}>
        <SelectField
          field="lang"
          label="Linguaggio"
          options={Object.fromEntries(task.supported_languages.map((l) => [l, l]))}
        />
        <SingleFileField
          field="src"
          label="Codice sorgente"
          validate={validateFile}
          optional={isSubmitPage}
        />
        <div className="mt-5 flex-none">
          <SubmitButton icon={Send}>Invia</SubmitButton>
        </div>
      </div>
      {({ lang }) => {
        const msg = langMessage(lang);
        if (!msg) return;
        return (
          <div className="mb-4 flex max-w-sm items-center gap-2 text-sm text-warning">
            <TriangleAlert size={16} className="flex-none" /> {msg}
          </div>
        );
      }}
      {isSubmitPage &&
        (({ lang, src }) => (
          <div className="relative min-h-[min(32rem,75vh)] w-full grow overflow-hidden rounded border border-base-content/10 *:absolute *:inset-0">
            <div className="skeleton rounded-none" />
            <Editor
              language={compilerLang(lang)}
              languages={task.supported_languages.map((l) => compilerLang(l))}
              file={src}
              onChange={setEditorValue}
            />
          </div>
        ))}
    </Form>
  );
}

function compilerLang(compiler?: string) {
  return compiler?.match(/^[+A-Za-z]+/)?.[0] ?? "Text";
}
