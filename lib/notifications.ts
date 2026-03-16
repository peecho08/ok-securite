import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/urls";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const EMAIL_FOOTER = `
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center">
    <p style="font-size:11px;color:#9ca3af;margin:0">
      <a href="${APP_URL}" style="color:#9ca3af;text-decoration:underline">OK Sécurité</a>
    </p>
    <p style="font-size:11px;color:#9ca3af;margin:4px 0 0">
      Pour ne plus recevoir ces courriels, rendez-vous dans les paramètres de votre compte.
    </p>
  </div>
`;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || "OK Sécurité <noreply@ok-securite.com>";

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
  await supabaseAdmin().from("notifications").insert({
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
        console.log(`Email sent to ${email.to}: ${email.subject}`);
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    } else {
      console.warn("RESEND_API_KEY not configured — skipping email to", email.to);
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

  const { data: supervisors, error: supError } = await supabaseAdmin()
    .from("org_members")
    .select("user_id, profiles(email, full_name)")
    .eq("org_id", orgId)
    .in("role", ["supervisor", "admin"]);

  if (supError) console.error("Failed to fetch supervisors for org", orgId, supError.message);
  console.log(`notifyChecklistCompleted: found ${supervisors?.length ?? 0} supervisors for org ${orgId}`);

  for (const sup of supervisors ?? []) {
    const profiles = sup.profiles as unknown as { email: string; full_name: string } | { email: string; full_name: string }[] | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    await notify({
      userId: sup.user_id as string,
      type: "checklist_completed",
      title: `${workerName} a complété: ${taskTitle}`,
      body: `Liste de vérification complétée avec succès.`,
      link: "/app/dashboard",
      email: profile?.email
        ? {
            to: profile.email,
            subject: `OK Sécurité — ${workerName} a complété: ${taskTitle}`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#22c55e;margin:0 0 16px">OK Sécurité</h2>
                <p><strong>${escapeHtml(workerName)}</strong> a complété la liste de vérification <strong>${escapeHtml(taskTitle)}</strong>.</p>
                <a href="${APP_URL}/dashboard"
                   style="display:inline-block;margin-top:16px;padding:10px 24px;background:#22c55e;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                  Voir le tableau de bord
                </a>
                ${EMAIL_FOOTER}
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

  const { data: supervisors } = await supabaseAdmin()
    .from("org_members")
    .select("user_id, profiles(email, full_name)")
    .eq("org_id", orgId)
    .in("role", ["supervisor", "admin"]);

  const severityLabel = severity === "critical" ? "CRITIQUE" : severity === "high" ? "ÉLEVÉE" : severity;

  for (const sup of supervisors ?? []) {
    const profiles = sup.profiles as unknown as { email: string; full_name: string } | { email: string; full_name: string }[] | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    await notify({
      userId: sup.user_id as string,
      type: "report_submitted",
      title: `Rapport: ${taskTitle} (${severityLabel})`,
      body: `${reporterName} a soumis un rapport d'incident.`,
      link: "/app/dashboard",
      email: profile?.email
        ? {
            to: profile.email,
            subject: `OK Sécurité — Rapport d'incident: ${taskTitle} (${severityLabel})`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#ef4444;margin:0 0 16px">Rapport d'incident — OK Sécurité</h2>
                <p><strong>${escapeHtml(reporterName)}</strong> a soumis un rapport pour <strong>${escapeHtml(taskTitle)}</strong>.</p>
                <p>Sévérité: <strong style="color:${severity === "critical" || severity === "high" ? "#ef4444" : "#f59e0b"}">${escapeHtml(severityLabel)}</strong></p>
                <a href="${APP_URL}/dashboard"
                   style="display:inline-block;margin-top:16px;padding:10px 24px;background:#ef4444;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                  Voir les détails
                </a>
                ${EMAIL_FOOTER}
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
  const { data: org } = await supabaseAdmin()
    .from("organizations")
    .select("created_by, name")
    .eq("id", orgId)
    .single();

  if (!org?.created_by) return;

  const { data: creator } = await supabaseAdmin()
    .from("profiles")
    .select("email")
    .eq("id", org.created_by)
    .single();

  await notify({
    userId: org.created_by,
    type: "member_joined",
    title: `${newMemberName} a rejoint ${org.name}`,
    body: "Nouveau membre dans votre équipe.",
    link: "/app/my-team",
    email: creator?.email
      ? {
          to: creator.email,
          subject: `OK Sécurité — ${newMemberName} a rejoint votre équipe`,
            html: `
            <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#22c55e;margin:0 0 16px">OK Sécurité</h2>
              <p><strong>${escapeHtml(newMemberName)}</strong> a rejoint votre équipe <strong>${escapeHtml(org.name)}</strong>.</p>
              <a href="${APP_URL}/my-team"
                 style="display:inline-block;margin-top:16px;padding:10px 24px;background:#22c55e;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                Voir l'équipe
              </a>
              ${EMAIL_FOOTER}
            </div>
          `,
        }
      : undefined,
  });
}
