import { MarketingShell } from "@/components/marketing-shell";

export const metadata = {
  title: "Conditions d'utilisation — OK Sécurité",
  description: "Conditions d'utilisation de l'application OK Sécurité.",
  alternates: { canonical: "https://ok-securite.com/terms" },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Conditions d&apos;utilisation
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Dernière mise à jour&nbsp;: 15 mars 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none dark:prose-invert [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant ou en utilisant l&apos;application OK Sécurité (« le Service »), exploitée
            par 15069685 Canada inc. (« nous », « notre »), vous acceptez d&apos;être lié par les
            présentes conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions,
            veuillez ne pas utiliser le Service.
          </p>

          <h2>2. Description du service</h2>
          <p>
            OK Sécurité est une application de listes de vérification pour la sécurité sur les
            chantiers de construction. Elle permet aux travailleurs de compléter des inspections
            et aux superviseurs de gérer des équipes, chantiers et listes personnalisées.
          </p>

          <h2>3. Comptes utilisateurs</h2>
          <p>
            Vous devez créer un compte pour accéder à certaines fonctionnalités. Vous êtes
            responsable de maintenir la confidentialité de vos identifiants et de toute
            activité effectuée sous votre compte.
          </p>

          <h2>4. Abonnements et paiements</h2>
          <ul>
            <li>Le forfait Gratuit offre un accès limité aux fonctionnalités de base.</li>
            <li>Les forfaits Argent et Or sont facturés mensuellement via Stripe.</li>
            <li>
              Vous pouvez annuler votre abonnement à tout moment depuis le portail de
              facturation. L&apos;accès reste actif jusqu&apos;à la fin de la période en cours.
            </li>
            <li>
              Les remboursements sont évalués au cas par cas. Contactez-nous à
              support@ok-securite.com.
            </li>
          </ul>

          <h2>5. Utilisation acceptable</h2>
          <p>Vous vous engagez à ne pas&nbsp;:</p>
          <ul>
            <li>Utiliser le Service à des fins illégales ou non autorisées.</li>
            <li>
              Tenter d&apos;accéder à des comptes ou données d&apos;autres utilisateurs sans
              autorisation.
            </li>
            <li>
              Introduire des virus, logiciels malveillants ou tout code nuisible.
            </li>
            <li>
              Surcharger ou perturber le fonctionnement du Service.
            </li>
          </ul>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Le contenu du Service, incluant les textes, logos, listes de vérification prédéfinies
            et le code source, est la propriété de 15069685 Canada inc. et protégé par les lois
            canadiennes sur le droit d&apos;auteur.
          </p>

          <h2>7. Limitation de responsabilité</h2>
          <p>
            OK Sécurité est un outil d&apos;aide à la conformité et ne remplace pas le jugement
            professionnel, les inspections officielles ou les obligations légales en matière de
            santé et sécurité au travail. L&apos;utilisation du Service ne garantit pas la
            conformité réglementaire.
          </p>
          <p>
            Dans toute la mesure permise par la loi, nous déclinons toute responsabilité pour
            les dommages directs, indirects ou consécutifs découlant de l&apos;utilisation du
            Service.
          </p>

          <h2>8. Résiliation</h2>
          <p>
            Nous nous réservons le droit de suspendre ou résilier votre accès au Service en cas
            de violation des présentes conditions, avec ou sans préavis.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Nous pouvons modifier ces conditions à tout moment. Les modifications prennent effet
            dès leur publication. Votre utilisation continue du Service après toute modification
            constitue votre acceptation des nouvelles conditions.
          </p>

          <h2>10. Loi applicable</h2>
          <p>
            Les présentes conditions sont régies par les lois du Québec et les lois fédérales
            du Canada qui s&apos;y appliquent. Tout litige sera soumis à la juridiction
            exclusive des tribunaux du Québec.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à&nbsp;:
            <a href="mailto:support@ok-securite.com" className="text-[var(--color-primary)] underline">
              support@ok-securite.com
            </a>
          </p>
        </div>
      </article>
    </MarketingShell>
  );
}
