-- Create test history table
create table if not exists public.test_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Index for fast user lookups
create index if not exists idx_test_history_user_id on public.test_history(user_id);
create index if not exists idx_test_history_created_at on public.test_history(created_at desc);

alter table public.test_history enable row level security;

create policy "test_history_select_own" on public.test_history for select using (auth.uid() = user_id);
create policy "test_history_insert_own" on public.test_history for insert with check (auth.uid() = user_id);
create policy "test_history_delete_own" on public.test_history for delete using (auth.uid() = user_id);
