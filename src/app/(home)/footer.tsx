import Link from "next/link";

import { Github, Youtube } from "lucide-react";

import oii from "~/app/icon0.svg";

export function Footer() {
  return (
    <div className="bg-base-200 text-base-content">
      <footer className="footer mx-auto max-w-screen-xl p-10">
        <aside>
          <img
            src={oii.src}
            width={oii.width}
            height={oii.height}
            alt="Logo Olimpiadi Italiane di Informatica"
            className="h-20 w-auto"
          />
          <p className="text-lg">Olimpiadi di Informatica</p>
        </aside>
        <nav>
          <h3 className="footer-title">Siti ufficiali</h3>
          <Link href="https://olimpiadi-informatica.it" className="link-hover link">
            Olimpiadi Italiane di Informatica
          </Link>
          <Link
            href="https://sites.google.com/aldini.istruzioneer.it/olimpiadi-informatica-squadre/homepage"
            className="link-hover link">
            Olimpiadi di Informatica a Squadre
          </Link>
          <Link href="https://fibonacci.olinfo.it" className="link-hover link">
            Giochi di Fibonacci
          </Link>
          <Link href="https://miur.gov.it/" className="link-hover link">
            Ministero dell'Istruzione e del Merito
          </Link>
          <Link href="https://www.aicanet.it/" className="link-hover link">
            AICA
          </Link>
        </nav>
        <nav>
          <h3 className="footer-title">Altre Risorse</h3>
          <Link href="https://stats.olinfo.it" className="link-hover link">
            Classifiche OII
          </Link>
          <Link href="https://squadre.olinfo.it" className="link-hover link">
            Classifiche OIS
          </Link>
          <Link href="https://status.olinfo.it" className="link-hover link">
            Stato server
          </Link>
          <Link href="https://wiki.olinfo.it" className="link-hover link">
            Wiki
          </Link>
          <div className="mt-1 flex gap-2">
            <Link href="https://github.com/olimpiadi-informatica">
              <Github size={20} />
            </Link>
            <Link href="https://www.youtube.com/@olimpiadiitalianediinforma4928">
              <Youtube size={20} />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}
