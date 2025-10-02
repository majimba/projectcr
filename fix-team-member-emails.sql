-- Update team_members to use the ACTUAL personal Gmail addresses
-- These are the only real email addresses (the @luminaryco.co ones don't exist)
-- Only hello@luminaryco.co is a real company email

UPDATE team_members SET email = 'chawana.maseka@gmail.com' WHERE name = 'Chawana Masaka' OR name = 'Chawana Maseka';
UPDATE team_members SET email = 'maynarjfilms@gmail.com' WHERE name = 'Maynard Muchangwe';
UPDATE team_members SET email = 'risendream@gmail.com' WHERE name = 'Emmanuel Kapili';
UPDATE team_members SET email = 'pandazm76@gmail.com' WHERE name = 'Munsanje Hachamba';
UPDATE team_members SET email = 'delphinemwape2@gmail.com' WHERE name = 'Delphine Mwape';

-- Verify the update
SELECT name, email, role FROM team_members ORDER BY joined_at;

