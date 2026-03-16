import { MarketingShell } from "@/components/marketing-shell";

export default function ChecklistsEnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
