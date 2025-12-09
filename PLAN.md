# Migration & Frontend TODO Plan

## Goals
- Clean and migrate WP data to a lean Postgres schema for the Next.js site (Docker on Lightsail).
- Remove unused plugin data (LatePoint, Events Manager, RevSlider, Action Scheduler, Elementor submissions, etc.).
- Build consistent Next.js pages for content (news, projects) pulling from the cleaned data.

## Database Cleanup & Migration (WP MySQL -> Postgres)
- Import dump (`database.sql`) into a temp MySQL; replace `SERVMASK_PREFIX_` with the real prefix (`wp_`).
- Drop plugin tables if unused: `latepoint_*`, `em_*`, `revslider_*`, `actionscheduler_*`, `booking*`, `e_*` (Elementor submissions).
- Trim core noise: delete revisions/auto-drafts; delete transients/options cache keys; prune `wp_postmeta` to a whitelist (`_thumbnail_id`, `_wp_attached_file`, `_wp_attachment_metadata`, `_wp_attachment_image_alt`, selected Elementor/ACF keys actually rendered).
- Extract content to Postgres schema:
  - Tables: `users`, `media`, `categories`, `tags`, `posts` (type `post/page/project`), `post_categories`, `post_tags`, optional `projects` if separated, `site_settings`.
  - Preserve slugs, published/draft status, featured images, categories/tags, attachments as media.
  - Users: copy display/email; reset passwords (do not reuse WP hashes).
- Load via Node/TS script (mysql2 -> Prisma/Postgres). Keep ID maps (WP id -> new id). Rewrite media URLs if moving to S3/CDN.
- Verify counts and spot-check content. Back up final Postgres snapshot.

## Frontend Tasks
- News listing and detail pages aligned with project styling; fetch from DB and log fetched arrays in dev.
- Ensure envs (`DB_HOST`, etc.) wired for Postgres when migrated; keep `node_modules` out of git.

## Deployment Notes
- Prefer managed Postgres on Lightsail; if containerized, mount volumes and schedule `pg_dump` backups.
- Keep `.env` secrets out of repo; add healthchecks and resource limits to Docker.
