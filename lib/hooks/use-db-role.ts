export async function persistRole(role: "worker" | "supervisor") {
  try {
    await fetch("/api/profile/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch {
    // Best-effort: role is also stored locally via setActiveRole
  }
}
