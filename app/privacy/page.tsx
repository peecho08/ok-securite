import { MarketingShell } from "@/components/marketing-shell";

export const metadata = {
  title: "Politique de confidentialité — OK Sécurité",
  description: "Politique de confidentialité de l'application OK Sécurité.",
  alternates: { canonical: "https://ok-securite.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Dernière mise à jour&nbsp;: 15 mars 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none dark:prose-invert [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
          <h2>1. Introduction</h2>
          <p>
            15069685 Canada inc. (« nous », « notre »), exploitant l&apos;application OK Sécurité,
            s&apos;engage à protéger la vie privée de ses utilisateurs conformément à la Loi sur
            la protection des renseignements personnels et les documents électroniques (LPRPDE /
            PIPEDA) et à la Loi 25 du Québec.
          </p>

          <h2>2. Renseignements collectés</h2>
          <p>Nous collectons les catégories de renseignements suivantes&nbsp;:</p>
          <ul>
            <li>
              <strong>Informations de compte&nbsp;:</strong> nom, adresse courriel, photo de profil
              (via Clerk).
            </li>
            <li>
              <strong>Données d&apos;utilisation&nbsp;:</strong> listes de vérification complétées,
              historique d&apos;inspections.
            </li>
            <li>
              <strong>Données d&apos;organisation&nbsp;:</strong> nom de l&apos;entreprise,
              membres de l&apos;équipe, chantiers.
            </li>
            <li>
              <strong>Données de paiement&nbsp;:</strong> traitées directement par Stripe. Nous ne
              stockons pas vos informations de carte de crédit.
            </li>
            <li>
              <strong>Données techniques&nbsp;:</strong> adresse IP, type de navigateur, données
              d&apos;analyse anonymisées (Vercel Analytics).
            </li>
          </ul>

          <h2>3. Utilisation des renseignements</h2>
          <p>Nous utilisons vos renseignements pour&nbsp;:</p>
          <ul>
            <li>Fournir et améliorer le Service.</li>
            <li>Gérer votre compte et vos abonnements.</li>
            <li>Envoyer des notifications liées à votre activité (complétions de listes).</li>
            <li>Assurer la sécurité et prévenir la fraude.</li>
            <li>Respecter nos obligations légales.</li>
          </ul>

          <h2>4. Partage des renseignements</h2>
          <p>
            Nous ne vendons pas vos renseignements personnels. Nous les partageons
            uniquement avec&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Fournisseurs de services&nbsp;:</strong> Clerk (authentification), Supabase
              (base de données), Stripe (paiements), Resend (courriels), Vercel (hébergement
              et analytique), PostHog (analytique de produit).
            </li>
            <li>
              <strong>Votre organisation&nbsp;:</strong> vos complétions de listes et rapports sont
              visibles par les superviseurs de votre équipe.
            </li>
            <li>
              <strong>Autorités légales&nbsp;:</strong> si requis par la loi ou pour protéger nos
              droits.
            </li>
          </ul>

          <h2>5. Stockage et sécurité</h2>
          <p>
            Vos données sont hébergées sur des serveurs sécurisés au Canada et aux États-Unis
            (Supabase, Vercel). Nous utilisons le chiffrement en transit (TLS) et des contrôles
            d&apos;accès stricts pour protéger vos renseignements.
          </p>

          <h2>6. Conservation des données</h2>
          <p>
            Nous conservons vos renseignements tant que votre compte est actif. En cas de
            suppression de votre compte, vos données personnelles seront supprimées dans un
            délai de 30 jours, à l&apos;exception des données requises pour des obligations
            légales ou comptables.
          </p>

          <h2>7. Vos droits</h2>
          <p>Conformément aux lois applicables, vous avez le droit de&nbsp;:</p>
          <ul>
            <li>Accéder à vos renseignements personnels.</li>
            <li>Rectifier des renseignements inexacts.</li>
            <li>Demander la suppression de vos données.</li>
            <li>Retirer votre consentement à tout moment.</li>
            <li>Déposer une plainte auprès de la Commission d&apos;accès à l&apos;information du Québec.</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à&nbsp;:
            <a href="mailto:privacy@ok-securite.com" className="text-[var(--color-primary)] underline">
              privacy@ok-securite.com
            </a>
          </p>

          <h2>8. Témoins (cookies) et analytique</h2>
          <p>
            Nous utilisons des témoins essentiels pour le fonctionnement du Service
            (authentification, préférences de langue).
          </p>
          <p>
            Nous utilisons également les services d&apos;analytique suivants, uniquement
            avec votre consentement&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Vercel Analytics&nbsp;:</strong> données d&apos;utilisation anonymisées
              (performance des pages, données agrégées). Aucun témoin de suivi tiers.
            </li>
            <li>
              <strong>PostHog&nbsp;:</strong> analytique de produit pour comprendre comment
              l&apos;application est utilisée et améliorer l&apos;expérience. PostHog collecte
              des données d&apos;utilisation liées à votre compte (pages visitées, fonctionnalités
              utilisées). Ces données sont hébergées aux États-Unis. Vous pouvez refuser ce suivi
              via le bandeau de consentement aux témoins.
            </li>
          </ul>

          <h2>9. Modifications</h2>
          <p>
            Nous pouvons mettre à jour cette politique à tout moment. Les modifications
            significatives seront communiquées par courriel ou via une notification dans
            l&apos;application.
          </p>

          <h2>10. Responsable de la protection des renseignements</h2>
          <p>
            Pour toute question relative à la protection de vos renseignements&nbsp;:
          </p>
          <p>
            15069685 Canada inc.<br />
            <a href="mailto:privacy@ok-securite.com" className="text-[var(--color-primary)] underline">
              privacy@ok-securite.com
            </a>
          </p>
        </div>
      </article>
    </MarketingShell>
  );
}
