export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "worker" | "supervisor" | null;
  org_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  invite_token: string;
  logo_url: string | null;
  website: string | null;
  team_tasks: string[];
  created_by: string | null;
  created_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: "worker" | "supervisor" | "admin";
  joined_at: string;
}

export interface Site {
  id: string;
  org_id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface ChecklistProgress {
  id: string;
  user_id: string;
  task_id: string;
  site_id: string | null;
  checked: string[];
  na: string[];
  updated_at: string;
}

export interface HistoryEntry {
  id: string;
  user_id: string;
  org_id: string | null;
  task_id: string;
  task_title: string;
  task_icon: string | null;
  worker_name: string | null;
  worker_company: string | null;
  site_id: string | null;
  site_name: string | null;
  checked_count: number;
  total_count: number;
  notes: string | null;
  image_url: string | null;
  completed_at: string;
}

export interface CustomTask {
  id: string;
  org_id: string;
  created_by: string | null;
  task_id: string;
  title: string;
  title_en: string | null;
  icon: string | null;
  description: string | null;
  category: string;
  checklist: unknown;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  org_id: string | null;
  site_id: string | null;
  task_id: string | null;
  task_title: string | null;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  reporter_name: string | null;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  task_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  org_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: "free" | "silver" | "gold";
  status: "active" | "past_due" | "canceled" | "trialing";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  profiles: Profile;
  organizations: Organization;
  org_members: OrgMember;
  sites: Site;
  checklist_progress: ChecklistProgress;
  history: HistoryEntry;
  custom_tasks: CustomTask;
  reports: Report;
  favorites: Favorite;
  notifications: Notification;
  subscriptions: Subscription;
}
