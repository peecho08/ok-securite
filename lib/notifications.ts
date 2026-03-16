import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || "OK Sécurité <noreply@ok-chantier.com>";

interface NotifyOptions {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  email?: {
    to: string;
    subject: string;
    html: string;
  };
}

export async function notify({ userId, type, title, body, link, email }: NotifyOptions) {
  await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    link: link ?? null,
  });

  if (email) {
    const resend = getResend();
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email.to,
          subject: email.subject,
          html: email.html,
        });
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }
  }
}

export async function notifyChecklistCompleted(
  userId: string,
  taskTitle: string,
  workerName: string,
  orgId: string | null
) {
  if (!orgId) return;

  const { data: supervisors } = await supabaseAdmin
    .from("org_members")
    .select("user_id, profiles(email, full_name)")
    .eq("org_id", orgId)
    .in("role", ["supervisor", "admin"]);

  for (const sup of supervisors ?? []) {
    const profile = sup.profiles as { email: string; full_name: string } | null;
    await notify({
      userId: sup.user_id as string,
      type: "checklist_completed",
      title: `${workerName} a complété: ${taskTitle}`,
      body: `Liste de vérification complétée avec succès.`,
      link: "/dashboard",
      email: profile?.email
        ? {
            to: profile.email,
            subject: `OK Sécurité — ${workerName} a complété: ${taskTitle}`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#22c55e;margin:0 0 16px">OK Sécurité</h2>
                <p><strong>${workerName}</strong> a complété la liste de vérification <strong>${taskTitle}</strong>.</p>
                <a href="https://app.ok-chantier.com/dashboard"
                   style="display:inline-block;margin-top:16px;padding:10px 24px;background:#22c55e;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                  Voir le tableau de bord
                </a>
              </div>
            `,
          }
        : undefined,
    });
  }
}

export async function notifyReportSubmitted(
  userId: string,
  taskTitle: string,
  severity: string,
  reporterName: string,
  orgId: string | null
) {
  if (!orgId) return;

  const { data: supervisors } = await supabaseAdmin
    .from("org_members")
    .select("user_id, profiles(email, full_name)")
    .eq("org_id", orgId)
    .in("role", ["supervisor", "admin"]);

  const severityLabel = severity === "critical" ? "CRITIQUE" : severity === "high" ? "ÉLEVÉE" : severity;

  for (const sup of supervisors ?? []) {
    const profile = sup.profiles as { email: string; full_name: string } | null;
    await notify({
      userId: sup.user_id as string,
      type: "report_submitted",
      title: `Rapport: ${taskTitle} (${severityLabel})`,
      body: `${reporterName} a soumis un rapport d'incident.`,
      link: "/dashboard",
      email: profile?.email
        ? {
            to: profile.email,
            subject: `OK Sécurité — Rapport d'incident: ${taskTitle} (${severityLabel})`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#ef4444;margin:0 0 16px">Rapport d'incident — OK Sécurité</h2>
                <p><strong>${reporterName}</strong> a soumis un rapport pour <strong>${taskTitle}</strong>.</p>
                <p>Sévérité: <strong style="color:${severity === "critical" || severity === "high" ? "#ef4444" : "#f59e0b"}">${severityLabel}</strong></p>
                <a href="https://app.ok-chantier.com/dashboard"
                   style="display:inline-block;margin-top:16px;padding:10px 24px;background:#ef4444;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                  Voir les détails
                </a>
              </div>
            `,
          }
        : undefined,
    });
  }
}

export async function notifyTeamJoined(
  newMemberName: string,
  orgId: string
) {
  const { data: org } = await supabaseAdmin
    .from("organizations")
    .select("created_by, name")
    .eq("id", orgId)
    .single();

  if (!org?.created_by) return;

  const { data: creator } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .eq("id", org.created_by)
    .single();

  await notify({
    userId: org.created_by,
    type: "member_joined",
    title: `${newMemberName} a rejoint ${org.name}`,
    body: "Nouveau membre dans votre équipe.",
    link: "/my-team",
    email: creator?.email
      ? {
          to: creator.email,
          subject: `OK Sécurité — ${newMemberName} a rejoint votre équipe`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#22c55e;margin:0 0 16px">OK Sécurité</h2>
              <p><strong>${newMemberName}</strong> a rejoint votre équipe <strong>${org.name}</strong>.</p>
              <a href="https://app.ok-chantier.com/my-team"
                 style="display:inline-block;margin-top:16px;padding:10px 24px;background:#22c55e;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                Voir l'équipe
              </a>
            </div>
          `,
        }
      : undefined,
  });
}
