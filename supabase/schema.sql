-- Users table (one row per wallet/user)
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  privy_user_id text unique not null,
  wallet_address text,
  email text,
  twitter_handle text,
  twitter_id text,
  plan text not null default 'free', -- free | core | trial
  trial_activated_at timestamptz,
  trial_expires_at timestamptz,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

create index if not exists users_privy_id_idx on users(privy_user_id);
create index if not exists users_wallet_idx on users(wallet_address);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  plan text not null, -- core | trial
  status text not null default 'active', -- active | cancelled | expired
  payment_tx text, -- on-chain tx hash
  payment_chain text default 'base',
  payment_token text, -- USDC | ETH | BNKR
  amount_usd numeric,
  started_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists subscriptions_user_idx on subscriptions(user_id);
create index if not exists subscriptions_status_idx on subscriptions(status);

-- Trial codes table
create table if not exists trial_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  created_by text default 'admin',
  used_by uuid references users(id),
  used_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists trial_codes_code_idx on trial_codes(code);

-- Enable RLS
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table trial_codes enable row level security;

-- Service role has full access
create policy "service_role_users" on users for all to service_role using (true) with check (true);
create policy "service_role_subscriptions" on subscriptions for all to service_role using (true) with check (true);
create policy "service_role_trial_codes" on trial_codes for all to service_role using (true) with check (true);
