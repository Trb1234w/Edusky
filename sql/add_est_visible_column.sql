ALTER TABLE public.formations
ADD COLUMN est_visible boolean DEFAULT true;

ALTER TABLE public.evenements
ADD COLUMN est_visible boolean DEFAULT true;

ALTER TABLE public.clubs
ADD COLUMN est_visible boolean DEFAULT true;
