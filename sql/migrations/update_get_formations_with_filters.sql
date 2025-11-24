-- Migration: Update get_formations function to include location and other filter fields
-- This migration adds missing fields to the get_formations function so that client-side filtering works properly

-- Drop the existing function first (required when changing return type)
DROP FUNCTION IF EXISTS get_formations(text, text, text, numeric, numeric, numeric, text);

create or replace function get_formations(
    search_term text default null,
    category_slug text default null,
    niveau_filter text default null,
    min_price numeric default null,
    max_price numeric default null,
    min_rating numeric default null,
    sort_by text default 'date_publication_desc'
)
returns table (
    id uuid,
    titre text,
    slug text,
    extrait text,
    image_url text,
    mode mode_cours,
    prix_indicatif numeric,
    note_moyenne numeric,
    nb_avis integer,
    professeur_id uuid,
    professeur_titre character varying,
    professeur_full_name text,
    professeur_avatar_url text,
    category_id uuid,
    category_nom text,
    categorie_slug text,
    niveau text,
    certificat boolean,
    duree_heures integer,
    duree_texte text,
    capacite integer,
    tags text[],
    pays_id uuid,
    ville_id uuid,
    quartier_id uuid
)
language plpgsql
as $$
begin
    return query
    select
        f.id,
        f.titre,
        f.slug,
        f.extrait,
        f.image_url,
        f.mode,
        f.prix_indicatif,
        f.note_moyenne,
        f.nb_avis,
        p.id as professeur_id,
        p.titre as professeur_titre,
        pr.full_name as professeur_full_name,
        pr.avatar_url as professeur_avatar_url,
        c.id as category_id,
        c.nom as category_nom,
        c.slug as categorie_slug,
        f.niveau,
        f.certificat,
        f.duree_heures,
        f.duree_texte,
        f.capacite,
        f.tags::text[],
        f.pays_id,
        f.ville_id,
        f.quartier_id
    from
        public.formations as f
    left join
        public.professeurs as p on f.professeur_id = p.id
    left join
        public.profiles as pr on p.id = pr.id
    left join
        public.categories as c on f.categorie_id = c.id
    where
        f.statut = 'publie'
        and (search_term is null or f.titre ilike '%' || search_term || '%' or f.description ilike '%' || search_term || '%')
        and (category_slug is null or c.slug = category_slug)
        and (niveau_filter is null or f.niveau = niveau_filter)
        and (min_price is null or f.prix_indicatif >= min_price)
        and (max_price is null or f.prix_indicatif <= max_price)
        and (min_rating is null or f.note_moyenne >= min_rating)
    order by
        case
            when sort_by = 'date_publication_desc' then f.date_publication
            else null
        end desc,
        case
            when sort_by = 'note_moyenne_desc' then f.note_moyenne
            else null
        end desc,
        case
            when sort_by = 'prix_asc' then f.prix_indicatif
            else null
        end asc,
        case
            when sort_by = 'prix_desc' then f.prix_indicatif
            else null
        end desc;
end;
$$;
