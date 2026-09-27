-- ===== profiles =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  display_name text not null default 'Tara Martin',
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
alter table public.profiles enable row level security;
create policy "Anyone can view profiles" on public.profiles for select to anon, authenticated using (true);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ===== roles =====
create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
alter table public.user_roles enable row level security;
create policy "Users can view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- ===== posts =====
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  topic text not null default 'Politics',
  read_minutes integer not null default 6,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  author_name text not null default 'Tara Martin',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
alter table public.posts enable row level security;
create policy "Anyone can read published posts" on public.posts for select to anon using (status = 'published');
create policy "Signed-in users can read all posts" on public.posts for select to authenticated using (true);
create policy "Admins can manage posts" on public.posts for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.update_updated_at_column() returns trigger
as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql set search_path = public;
create trigger posts_updated_at before update on public.posts for each row execute function public.update_updated_at_column();

-- ===== newsletter =====
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert to anon with check (true);
create policy "Admins can view subscribers" on public.newsletter_subscribers for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can remove subscribers" on public.newsletter_subscribers for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ===== seed essays (byline: Tara Martin) =====
insert into public.posts (slug, title, excerpt, content, topic, read_minutes, status, featured, published_at) values
('the-state-wants-you-quiet',
 'The State Wants You Quiet. I Refuse.',
 'On the quiet machinery of respectability, and why the loudest room is the only one that ever changed a law.',
 $$They tell us the polite way to lose our rights is quietly. Fill out the right form. Wait the right number of days. Smile at the counter clerk who decides, with a keystroke, whether your name is real.

Decorum is not neutrality. It never was. Decorum is a tool with a hand on it, and the hand belongs to whoever is comfortable. When they say "can we not do this right now," what they mean is: this is inconvenient for me, and your life is negotiable.

I have watched people master the art of being unobjectionable — in offices, in courtrooms, in family group chats — and I have watched the floor move under them anyway. Politeness did not save them. It only made them quieter while it happened.

So here is my refusal, stated plainly: I will not modulate my life down to a volume that makes power comfortable. Rights are not granted by the well-behaved. They are taken by the loud, held by the organized, and kept by everyone who refuses to go back in the closet of good manners.

The state wants you quiet because quiet is how it does its work. Refuse. In print, in person, in every room that pretends this is only a debate.$$,
 'Politics', 9, 'published', true, '2026-09-12T08:00:00Z'),
('passing-is-a-tax',
 'Passing Is a Tax. I Quit Paying.',
 'On the exhausting arithmetic of being legible to people who never asked to be.',
 $$There is a ledger I never agreed to keep: the running count of every room where I was read, misread, or measured. Passing is talked about like a prize. It is closer to a subscription — a monthly fee paid in vigilance, in bathroom math, in the specific exhaustion of editing your voice before the door opens.

The tax is not the passing. The tax is the uncertainty. It is doing the arithmetic in every lobby, every airport line, every elevator: who is counting, what are they counting toward, and what happens if I am found out.

I am not interested in a better disguise. I am interested in a world where the audit is illegal, where the presumption is not suspicion but the plain fact of a person standing in front of you.

Until then: I quit paying more than I must. Not because I have stopped being visible, but because I have stopped apologizing for it.$$,
 'Queer', 7, 'published', false, '2026-08-08T08:00:00Z'),
('the-ballot-is-a-weapon',
 'The Ballot Is a Weapon, Not a Ritual',
 'Why civic duty language is a way to make you feel responsible for a system that was never yours.',
 $$Every election cycle, the same sermon: your vote is your voice, civic duty, the sacred ritual. And every cycle, the same candidates run on making people like me legal or not, safe or not, existent or not.

A ballot is not a prayer. It is a weapon — the only one the system hands you, dulled and metered, with instructions to use it on the schedule that suits them. Refusing to vote is not purity. It is surrender of the only weapon you were given. But voting like it is a moral cleanse is worse: it mistakes participation for power.

Power lives in the organizing between elections. It lives in the school board meeting with five people in the room. It lives in the county office where a rule becomes real. The ballot is one strike of the hammer; the organizing is the anvil.

So vote like you mean it, and then do the part of the work that does not fit in a booth. That is the whole difference between a ritual and a weapon.$$,
 'Politics', 8, 'published', false, '2026-07-01T08:00:00Z'),
('zines-dont-apologize',
 'Zines Don''t Apologize for Being Small',
 'A defense of the photocopied, the misregistered, and the deliberately unpolished.',
 $$There is a particular smell to a photocopied zine — toner heat and cheap paper — that no gloss will ever replicate, because what it carries is permission. Permission to be small. Permission to be urgent and unfinished.

The internet promised scale and delivered algorithms. A zine never promised you an audience. It promised you an artifact: something you made with your hands that a stranger might pull out of their coat three winters from now.

Our movements were built on small, rude, misregistered pages. The archive of queer survival is not a corporate content calendar. It is a shoebox. It is a flyer run off in someone''s basement at 2 a.m.

Make small things. Make them badly on purpose. The point was never polish. The point was that it exists.$$,
 'Culture', 5, 'published', false, '2026-06-22T08:00:00Z'),
('love-is-a-political-act',
 'Love Is a Political Act',
 'Every hand held in a public square is a small, defiant act of governance.',
 $$They would like our love to be private, by which they mean invisible, by which they mean negotiable. Every generation learns the same lesson: what is hidden gets rewritten.

So we hold hands in the grocery store, at the funeral, in the small town with one traffic light. Not as a spectacle. As a record. Every public tenderness is a line in a ledger that says: we were here, we were not asking, and it was Tuesday.

This is not about display. It is about the ordinary. The most radical thing a couple can do in a hostile jurisdiction is nothing at all — buy the milk, walk the dog, exist at the normal volume of any other life.

Governments write laws. People write the ordinary. The ordinary wins, eventually, because you cannot legislate against Tuesday.$$,
 'Queer', 6, 'published', false, '2026-05-14T08:00:00Z'),
('respectability-is-a-cage',
 'Respectability Is a Cage With a Gold Lock',
 'The price of being "acceptable" is the slow erasure of the self that fought to be here.',
 $$Respectability is the deal you are offered when they have decided you are almost a person: behave, edit, preface, and we will let you into rooms where you will be tolerated exactly as long as you are useful.

The lock is gold and it turns smooth. That is the trap. From the inside, it looks like success. You get the meeting, the byline, the seat at the table — and slowly the seat becomes your whole self, because the self that fought to be here does not fit through the door they opened.

The history of every marginalized movement is a fight between two strategies: the ones who asked to be let in nicely, and the ones who broke the door. History remembers the negotiators fondly after they lose, and the door-breakers fondly after they win.

Be useful in the rooms. But keep the tools. Respectability is a cage, and cages are for animals, and we are not animals.$$,
 'Politics', 7, 'published', false, '2026-04-05T08:00:00Z'),
('the-archive-is-a-body',
 'The Archive Is a Body',
 'What we choose to preserve is a statement about who was allowed to exist.',
 $$An archive is not a warehouse. It is a body — it breathes, it remembers unevenly, it aches where it was wounded.

For most of modern history, the official record refused to know us. Our obituaries lied about our partners. Our clinics burned their files. Our witnesses died. What survived, survived in shoeboxes and address books and the memory of people who kept lists precisely because they knew the lists would matter.

That is why hoarding our own history is not nostalgia. It is evidence maintenance. When the state rewrites who existed, the shoebox is the rebuttal.

Contribute to the archive. Scan the flyers. Record your elders. Label the photographs with names before the names dissolve. A community that does not keep its own record will be described by people who were not there — and description is a kind of power.$$,
 'Culture', 6, 'published', false, '2026-03-28T08:00:00Z');