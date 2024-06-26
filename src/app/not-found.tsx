import Link from "next/link";

import { Home } from "lucide-react";

export default function Page() {
  return (
    <div className="flex grow flex-col items-center justify-center gap-4">
      <div className="text-xl font-bold">Questa pagina non è stata trovata 😢</div>
      <Link href="/" className="btn btn-primary">
        <Home size={22} /> Torna alla home
      </Link>
    </div>
  );
}
