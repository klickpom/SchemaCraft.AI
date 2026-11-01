-- SchemaCraft radar. auth.uid() matches Supabase; tests set request.jwt.claim.sub.
create schema if not exists auth;

create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create table if not exists public.users (
  id uuid primary key,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  domain text not null,
  country text not null,
  city text not null,
  language text not null,
  niche text not null,
  brand text not null,
  homepage_text text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete cascade,
  body text not null,
  locale text not null,
  position integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete cascade,
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  engine text not null,
  run_index integer not null,
  raw_answer text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete cascade,
  run_id uuid not null references public.runs (id) on delete cascade,
  brand_mentioned boolean not null,
  domain_mentioned boolean not null,
  position integer,
  sentiment text not null,
  competitors jsonb not null default '[]'::jsonb,
  cited_urls jsonb not null default '[]'::jsonb
);

create table if not exists public.fixes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  plan text not null,
  status text not null default 'active',
  monthly_budget_usd numeric not null,
  period_start timestamptz not null default now()
);

create table if not exists public.usage_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  run_id uuid references public.runs (id) on delete set null,
  engine text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  cost_usd numeric not null,
  created_at timestamptz not null default now()
);

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nosuperuser nobypassrls nologin;
  end if;
end $$;

grant usage on schema auth, public to authenticated;
grant execute on function auth.uid() to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

alter table public.users enable row level security;
alter table public.users force row level security;
alter table public.sites enable row level security;
alter table public.sites force row level security;
alter table public.prompts enable row level security;
alter table public.prompts force row level security;
alter table public.runs enable row level security;
alter table public.runs force row level security;
alter table public.mentions enable row level security;
alter table public.mentions force row level security;
alter table public.fixes enable row level security;
alter table public.fixes force row level security;
alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;
alter table public.usage_costs enable row level security;
alter table public.usage_costs force row level security;

drop policy if exists users_own on public.users;
create policy users_own on public.users for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists sites_own on public.sites;
create policy sites_own on public.sites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists prompts_own on public.prompts;
create policy prompts_own on public.prompts for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists runs_own on public.runs;
create policy runs_own on public.runs for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists mentions_own on public.mentions;
create policy mentions_own on public.mentions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists fixes_own on public.fixes;
create policy fixes_own on public.fixes for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists subscriptions_own on public.subscriptions;
create policy subscriptions_own on public.subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists usage_costs_own on public.usage_costs;
create policy usage_costs_own on public.usage_costs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
