-- ============================================================================
-- Optional seed data — practice areas + a few sample lawyer profiles.
-- Run AFTER schema.sql. Lawyer profiles here are display-only placeholders;
-- real lawyers should be created through Supabase Auth so they can log in.
-- ============================================================================

insert into public.practice_areas (name, slug, description, icon) values
  ('Corporate Law', 'corporate', 'Mergers, acquisitions, governance and commercial contracts.', 'Building2'),
  ('Family Law', 'family', 'Divorce, custody, adoption and domestic relations.', 'Heart'),
  ('Criminal Defense', 'criminal', 'Trial defense, appeals and pre-charge representation.', 'Scale'),
  ('Real Estate', 'real-estate', 'Transactions, leasing, zoning and property disputes.', 'Home'),
  ('Intellectual Property', 'ip', 'Patents, trademarks, copyright and licensing.', 'Lightbulb'),
  ('Employment Law', 'employment', 'Workplace disputes, contracts and compliance.', 'Briefcase')
on conflict (slug) do nothing;
