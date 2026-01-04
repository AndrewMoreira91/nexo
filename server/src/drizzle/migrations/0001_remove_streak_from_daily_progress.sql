-- Remove a coluna streak da tabela daily_progress
-- O streak agora é calculado dinamicamente e armazenado apenas na tabela users
ALTER TABLE "daily_progress" DROP COLUMN IF EXISTS "streak";
