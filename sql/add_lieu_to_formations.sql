-- Add lieu column to formations table
ALTER TABLE public.formations ADD COLUMN lieu text;

-- Optional: Update existing rows with a default value if needed
-- UPDATE public.formations SET lieu = 'Campus Principal' WHERE lieu IS NULL;
