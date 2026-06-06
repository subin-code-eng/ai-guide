-- ============================================================
-- Mysuru Beyond — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. ROLES
create type public.app_role as enum ('visitor', 'artisan', 'admin');

-- 2. PROFILES (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 3. USER ROLES (separate table — never store role on profiles)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

-- Security-definer helper (avoids recursive RLS)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- 4. AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.user_roles (user_id, role)
  values (new.id, 'visitor');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. ARTISAN PROFILES (user-submitted artisan cards)
create table public.artisan_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  craft text not null,
  specialty text not null,
  story text not null,
  experience text not null,
  location text not null,
  contact text,
  products text[] not null default '{}',
  photo_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

grant select on public.artisan_profiles to anon;
grant select, insert, update, delete on public.artisan_profiles to authenticated;
grant all on public.artisan_profiles to service_role;

alter table public.artisan_profiles enable row level security;

create policy "Published artisan profiles are public"
  on public.artisan_profiles for select
  using (published = true or auth.uid() = user_id);

create policy "Users can insert their own artisan profile"
  on public.artisan_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own artisan profile"
  on public.artisan_profiles for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own artisan profile"
  on public.artisan_profiles for delete
  to authenticated
  using (auth.uid() = user_id);

-- When a user creates an artisan profile, upgrade their role
create or replace function public.grant_artisan_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.user_id, 'artisan')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger on_artisan_profile_created
  after insert on public.artisan_profiles
  for each row execute function public.grant_artisan_role();

-- updated_at auto-update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger artisan_profiles_updated_at before update on public.artisan_profiles
  for each row execute function public.set_updated_at();

-- 6. STORAGE BUCKET for artisan photos
insert into storage.buckets (id, name, public)
values ('artisan-photos', 'artisan-photos', true)
on conflict (id) do nothing;

create policy "Artisan photos are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'artisan-photos');

create policy "Authenticated users can upload their artisan photo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'artisan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own artisan photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'artisan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own artisan photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'artisan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 7. FEEDBACK (user testimonials / ratings)
-- ============================================================
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  rating int not null check (rating between 1 and 5),
  category text not null check (category in ('general', 'places', 'artisans', 'trails', 'ai', 'bug', 'suggestion')),
  message text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.feedback to anon;
grant select, insert on public.feedback to authenticated;
grant all on public.feedback to service_role;

alter table public.feedback enable row level security;

create policy "Published feedback is viewable by everyone"
  on public.feedback for select
  using (published = true);

create policy "Authenticated users can submit feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
  on public.feedback for select
  to authenticated
  using (auth.uid() = user_id);
