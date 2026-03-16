-- OK Sécurité — Supabase schema
-- Run this in the Supabase SQL editor to create all tables.

-- ── Profiles (synced from Clerk) ───────────────────────────────────
create table if not exists profiles (
  id text primary key,             -- Clerk user ID
  email text,
  full_name text,
  role text default 'worker' check (role in ('worker', 'supervisor')),
  org_id uuid references organizations(id) on delete set null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Organizations (teams) ──────────────────────────────────────────
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_token text unique default encode(gen_random_bytes(12), 'hex'),
  logo_url text,
  website text,
  team_tasks text[] default '{}',
  created_by text references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- ── Org members ────────────────────────────────────────────────────
create table if not exists org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id text not null references profiles(id) on delete cascade,
  role text default 'worker' check (role in ('worker', 'supervisor', 'admin')),
  joined_at timestamptz default now(),
  unique (org_id, user_id)
);

-- ── Construction sites ─────────────────────────────────────────────
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  active boolean default true,
  created_by text references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- ── Checklist progress (in-flight, not yet completed) ──────────────
create table if not exists checklist_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id) on delete cascade,
  task_id text not null,
  site_id uuid references sites(id) on delete set null,
  checked text[] default '{}',
  na text[] default '{}',
  updated_at timestamptz default now(),
  unique (user_id, task_id)
);

-- ── History (completed checklists) ─────────────────────────────────
create table if not exists history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id) on delete cascade,
  org_id uuid references organizations(id) on delete set null,
  task_id text not null,
  task_title text not null,
  task_icon text,
  worker_name text,
  worker_company text,
  site_id uuid references sites(id) on delete set null,
  site_name text,
  checked_count integer not null default 0,
  total_count integer not null default 0,
  notes text,
  image_url text,
  completed_at timestamptz default now()
);

-- ── Custom tasks (supervisor-created templates) ────────────────────
create table if not exists custom_tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  created_by text references profiles(id) on delete set null,
  task_id text not null,
  title text not null,
  title_en text,
  icon text,
  description text,
  category text default 'custom',
  checklist jsonb not null default '[]',
  created_at timestamptz default now(),
  unique (org_id, task_id)
);

-- ── Reports (incidents / near-misses) ──────────────────────────────
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id) on delete cascade,
  org_id uuid references organizations(id) on delete set null,
  site_id uuid references sites(id) on delete set null,
  task_id text,
  task_title text,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  description text not null,
  reporter_name text,
  created_at timestamptz default now()
);

-- ── Favorites ──────────────────────────────────────────────────────
create table if not exists favorites (
  user_id text not null references profiles(id) on delete cascade,
  task_id text not null,
  created_at timestamptz default now(),
  primary key (user_id, task_id)
);

-- ── Notifications ──────────────────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ── Subscriptions (Stripe) ─────────────────────────────────────────
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free' check (plan in ('free', 'silver', 'gold')),
  status text default 'active' check (status in ('active', 'past_due', 'canceled', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id)
);

-- ── Indexes ────────────────────────────────────────────────────────
create index if not exists idx_org_members_org on org_members(org_id);
create index if not exists idx_org_members_user on org_members(user_id);
create index if not exists idx_history_user on history(user_id);
create index if not exists idx_history_org on history(org_id);
create index if not exists idx_history_completed on history(completed_at desc);
create index if not exists idx_sites_org on sites(org_id);
create index if not exists idx_notifications_user on notifications(user_id, read, created_at desc);
create index if not exists idx_reports_org on reports(org_id);
create index if not exists idx_organizations_invite on organizations(invite_token);

-- ── Migration: add team_tasks if missing ────────────────────────────
-- ALTER TABLE organizations ADD COLUMN IF NOT EXISTS team_tasks text[] DEFAULT '{}';

-- ── Migration: add notes & image_url to history ─────────────────────
-- ALTER TABLE history ADD COLUMN IF NOT EXISTS notes text;
-- ALTER TABLE history ADD COLUMN IF NOT EXISTS image_url text;

-- ── Row Level Security ─────────────────────────────────────────────
-- NOTE: These RLS policies use auth.uid() (Supabase Auth). Since this
-- app uses Clerk for authentication, auth.uid() will be NULL for
-- browser-side calls. All mutations go through API routes using the
-- service-role key (supabaseAdmin), which bypasses RLS entirely.
-- These policies serve as a defense-in-depth layer if the anon key
-- is ever used directly from the client.
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table org_members enable row level security;
alter table sites enable row level security;
alter table checklist_progress enable row level security;
alter table history enable row level security;
alter table custom_tasks enable row level security;
alter table reports enable row level security;
alter table favorites enable row level security;
alter table notifications enable row level security;
alter table subscriptions enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on profiles for select using (id = auth.uid()::text);
create policy "Users can update own profile" on profiles for update using (id = auth.uid()::text);

-- Organizations: members can view their org
create policy "Org members can view org" on organizations for select
  using (id in (select org_id from org_members where user_id = auth.uid()::text));
create policy "Supervisors can update org" on organizations for update
  using (id in (select org_id from org_members where user_id = auth.uid()::text and role in ('supervisor', 'admin')));
create policy "Anyone can read by invite token" on organizations for select
  using (invite_token is not null);

-- Org members: members can see fellow members
create policy "Members can view org members" on org_members for select
  using (org_id in (select org_id from org_members m where m.user_id = auth.uid()::text));
create policy "Supervisors can manage members" on org_members for all
  using (org_id in (select org_id from org_members m where m.user_id = auth.uid()::text and m.role in ('supervisor', 'admin')));

-- Sites: org members can view, supervisors can manage
create policy "Org members can view sites" on sites for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text));
create policy "Supervisors can manage sites" on sites for all
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text and role in ('supervisor', 'admin')));

-- Checklist progress: own data only
create policy "Users own their progress" on checklist_progress for all
  using (user_id = auth.uid()::text);

-- History: own entries + org members can view org history
create policy "Users can view own history" on history for select
  using (user_id = auth.uid()::text);
create policy "Users can insert own history" on history for insert
  with check (user_id = auth.uid()::text);
create policy "Org members can view org history" on history for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text));

-- Custom tasks: org members can view, supervisors can manage
create policy "Org members can view custom tasks" on custom_tasks for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text));
create policy "Supervisors can manage custom tasks" on custom_tasks for all
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text and role in ('supervisor', 'admin')));

-- Reports: own entries + org supervisors can view
create policy "Users can insert own reports" on reports for insert
  with check (user_id = auth.uid()::text);
create policy "Users can view own reports" on reports for select
  using (user_id = auth.uid()::text);
create policy "Supervisors can view org reports" on reports for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text and role in ('supervisor', 'admin')));

-- Favorites: own data only
create policy "Users own their favorites" on favorites for all
  using (user_id = auth.uid()::text);

-- Notifications: own data only
create policy "Users own their notifications" on notifications for select
  using (user_id = auth.uid()::text);
create policy "Users can update own notifications" on notifications for update
  using (user_id = auth.uid()::text);

-- Subscriptions: org members can view
create policy "Org members can view subscription" on subscriptions for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()::text));
create policy "System can manage subscriptions" on subscriptions for all
  using (auth.uid() is not null);
