-- Add section visibility settings
INSERT INTO site_settings (key, value) VALUES 
('section_visibility', '{
  "blog": true,
  "minecraft_plans": true,
  "discord_plans": true,
  "minecraft_server": true,
  "telegram_bots": true,
  "cinematic_reel": true,
  "discord_automation": true,
  "testimonials": true,
  "stats_counter": true,
  "achievements": true,
  "about": true,
  "skills": true,
  "projects": true,
  "contact": true,
  "future_goals": true
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add admin PIN setting (default: 1234, hashed)
INSERT INTO site_settings (key, value) VALUES 
('admin_pin', '{"pin": "1234", "lockout_until": null, "failed_attempts": 0}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;