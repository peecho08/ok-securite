-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bdmfjbptjmoiqwzgkrqk/sql/new

-- Step 1: Create organizations WITHOUT the created_by FK
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_token text unique default encode(gen_random_bytes(12), 'hex'),
  logo_url text,
  website text,
  team_tasks text[] default '{}',
  created_by text,
  created_at timestamptz default now()
);

-- Step 2: Create profiles (references organizations)
create table if not exists profiles (
  id text primary key,
  email text,
  full_name text,
  role text default null check (role in ('worker', 'supervisor')),
  org_id uuid references organizations(id) on delete set null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Step 3: Add the FK from organizations.created_by -> profiles.id
do $$ begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'organizations_created_by_fkey'
  ) then
    alter table organizations add constraint organizations_created_by_fkey
      foreign key (created_by) references profiles(id) on delete set null;
  end if;
end $$;

-- Step 4: Remaining tables
create table if not exists org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id text not null references profiles(id) on delete cascade,
  role text default 'worker' check (role in ('worker', 'supervisor', 'admin')),
  joined_at timestamptz default now(),
  unique (org_id, user_id)
);

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
  completed_at timestamptz default now()
);

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

create table if not exists favorites (
  user_id text not null references profiles(id) on delete cascade,
  task_id text not null,
  created_at timestamptz default now(),
  primary key (user_id, task_id)
);

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

-- Indexes
create index if not exists idx_org_members_org on org_members(org_id);
create index if not exists idx_org_members_user on org_members(user_id);
create index if not exists idx_history_user on history(user_id);
create index if not exists idx_history_org on history(org_id);
create index if not exists idx_history_completed on history(completed_at desc);
create index if not exists idx_sites_org on sites(org_id);
create index if not exists idx_notifications_user on notifications(user_id, read, created_at desc);
create index if not exists idx_reports_org on reports(org_id);
create index if not exists idx_organizations_invite on organizations(invite_token);

-- RLS
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
