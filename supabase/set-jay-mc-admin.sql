-- Set Jay as Mission Control admin
-- This grants access to the MC dashboard

UPDATE humans
SET mc_admin = true
WHERE email = 'jay@solisinteractive.com';

-- Verify it worked
SELECT email, mc_admin FROM humans WHERE email = 'jay@solisinteractive.com';
