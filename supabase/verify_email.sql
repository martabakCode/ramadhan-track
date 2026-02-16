-- SQL command to manually verify a user's email
-- Run this in the Supabase SQL Editor

-- Replace 'YOUR_EMAIL@example.com' with the email address you registered with
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'admin@martabakcode.my.id';
