"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export default function BienEtrePage() {
  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors active:bg-gray-100"
            aria-label="Retour"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold">Bien-être</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 sm:px-8">
        <p className="text-base text-gray-600 dark:text-neutral-300">
          Ta santé compte — corps et tête. Des ressources existent si tu en as besoin.
        </p>

        <section className="mt-8 rounded-2xl border-2 border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950">
          <h2 className="font-heading text-lg font-bold text-green-900">
            Construire en santé
          </h2>
          <p className="mt-2 text-sm text-green-800">
            24/7 · Gratuit · Confidentiel
          </p>
          <p className="mt-1 text-sm text-green-700">
            Pour les travailleurs de la construction et leurs proches.
          </p>

          <a
            href="tel:18008072433"
            className="mt-4 flex items-center gap-3 rounded-xl bg-[#118914] px-4 py-3.5 font-heading text-base font-bold text-white transition-colors active:bg-[#0e7511]"
          >
            <Phone className="h-5 w-5 shrink-0" />
            1 800 807-2433
          </a>

          <ul className="mt-4 space-y-1.5 text-sm text-green-800">
            <li>· Soutien psychologique</li>
            <li>· Stress et sommeil</li>
            <li>· Dépendances (tabac, alcool, drogues, jeu)</li>
            <li>· Maladies chroniques</li>
            <li>· Intervention post-traumatique</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3">
          <a
            href="https://www.cnesst.gouv.qc.ca/fr/sante-securite-travail"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          >
            <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
              CNESST — Santé et sécurité au travail
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Droits, normes et ressources en milieu de travail
            </p>
          </a>

          <a
            href="tel:18662773553"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Tel-Aide · 1 866 277-3553
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Écoute et soutien · 24/7 · Gratuit · Confidentiel
              </p>
            </div>
          </a>

          <a
            href="tel:18664277273"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Drogue: aide et référence · 1 866 427-7273
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Information et orientation · 24/7
              </p>
            </div>
          </a>

          <a
            href="tel:18006652000"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Jeu: aide et référence · 1 800 665-2000
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Soutien pour les problèmes de jeu · 24/7
              </p>
            </div>
          </a>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-heading text-base font-bold text-gray-900 dark:text-neutral-100">
            Conseils rapides
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">Parler, c&apos;est pas faible</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Tu te casserais pas le bras sans aller à l&apos;urgence. C&apos;est pareil pour ta tête. Appelle si ça va pas.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">Le sommeil, c&apos;est du sérieux</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Fatigué = moins vigilant. Un bon 7-8 h, c&apos;est un EPI comme les autres.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">Surveille tes chums</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Un gars qui parle plus, qui s&apos;isole, qui perd patience — demande-lui comment ça va. Ça peut tout changer.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
