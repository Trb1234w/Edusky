CREATE OR REPLACE FUNCTION get_distinct_locations()
RETURNS JSON AS $$
DECLARE
    locations JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'countries', (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', id, 'nom', nom)), '[]') FROM public.pays),
        'villes', (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', id, 'nom', nom, 'pays_id', pays_id)), '[]') FROM public.villes),
        'quartiers', (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', id, 'nom', nom, 'ville_id', ville_id)), '[]') FROM public.quartiers)
    )
    INTO locations;

    RETURN locations;
END;
$$ LANGUAGE plpgsql;
