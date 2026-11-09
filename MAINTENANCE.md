# Station administration

On the main site, click the person icon beside the theme and language controls. Editors use email and password. They can change station 1–4 text and MP4 videos, preview edits, and publish. Changes are stored in Supabase; students see the latest version on reload. Sessions and unpublished drafts stay in memory.

## One-time activation by the project owner

1. Create or select a university-controlled Supabase project. In Auth enable Email/password and disable public sign-ups.
2. Run maintenance/station-auth.sql once in the project's SQL editor. This installs read access to published content and restricts writes to explicitly authorized users.
3. Create and confirm an account in Auth → Users. Add its UUID in the station_editors table using the dashboard. Remove this row to revoke editing rights.
4. Put the HTTPS project URL (without a trailing slash) and its **publishable** key in station-auth.js and deploy. Never include a secret or service_role key. Publishable keys are meant to be public; authorization comes from row-level security.
5. Test an unauthenticated read, a denied write, an authorized edit, video upload and sign-out with the university's test account. Passwords should be set privately. For email-based password recovery configure the project's email delivery.
