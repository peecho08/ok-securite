import { MarketingShell } from "@/components/marketing-shell";

export default function ChecklistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
