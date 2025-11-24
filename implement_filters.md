Guide d'implémentation : Filtres UI pour Événements, Clubs et Blogs
🎯 Vue d'ensemble
Ce guide vous permet de terminer l'implémentation des filtres pour les pages événements, clubs et blogs en suivant exactement le même pattern que les formations.

✅ Déjà fait
✅ Fonctions SQL créées et déployées
✅ Actions serveur créées (getAllEvenements, getAllClubs, getAllArticles)
✅ Migrations SQL exécutées avec succès
✅ Fonctions pour récupérer tags, types, thèmes, lieux
📋 Fichiers à modifier
Événements
components/evenements-filter-wrapper.tsx
 - Wrapper principal
components/ui/evenement-sidebar.tsx
 - Sidebar desktop
Clubs
components/clubs-filter-wrapper.tsx
 - Wrapper principal
components/ui/club-sidebar.tsx
 - Sidebar desktop
Blogs
components/blog-filter-wrapper.tsx
 - Wrapper principal
components/ui/blog-sidebar.tsx
 - Sidebar desktop
🔧 Pattern à suivre (basé sur formations)
1. Wrapper de filtres
Référence : 
components/formations-filter-wrapper.tsx

Imports à ajouter
import { getAllEvenements, getDistinctEventTags, getDistinctEventTypes } from "@/app/evenements/get-data"
import { getDistinctLocations } from "@/app/formations/get-locations" // Réutiliser pour événements
États à ajouter
// Pour événements (avec localisation)
const [locations, setLocations] = useState<{
  countries: Location[];
  villes: Ville[];
  quartiers: Quartier[];
}>({ countries: [], villes: [], quartiers: [] })
const [availableTags, setAvailableTags] = useState<string[]>([])
const [availableTypes, setAvailableTypes] = useState<string[]>([])
const [filters, setFilters] = useState<Record<string, any>>({
  search: "",
  categorySlugs: undefined,
  pays_id: undefined,
  ville_id: undefined,
  quartier_id: undefined,
  mode: undefined,
  type_evenement: undefined,
  tags: undefined,
  hasCapacity: undefined,
  dateFilter: undefined,
})
Fetch des données
useEffect(() => {
  const fetchData = async () => {
    const [eventsResult, locationsResult, tagsResult, typesResult] = await Promise.all([
      getAllEvenements(),
      getDistinctLocations(),
      getDistinctEventTags(),
      getDistinctEventTypes()
    ]);
    
    if (eventsResult.data) setAllEvents(eventsResult.data);
    if (locationsResult.data) setLocations(locationsResult.data);
    if (tagsResult.data) setAvailableTags(tagsResult.data);
    if (typesResult.data) setAvailableTypes(typesResult.data);
    
    setIsLoading(false);
  };
  fetchData();
}, [])
Logique de filtrage en cascade
const handleFilterChange = (key: string, value: any) => {
  setFilters(prev => {
    const newFilters = { ...prev, [key]: value };
    
    // Cascade pour localisation (événements seulement)
    if (key === 'pays_id') {
      newFilters.ville_id = undefined;
      newFilters.quartier_id = undefined;
    } else if (key === 'ville_id') {
      newFilters.quartier_id = undefined;
    }
    
    return newFilters;
  });
}
Filtrage client
const filteredEvents = useMemo(() => {
  return allEvents.filter(event => {
    // Filtres de base
    const searchMatch = !filters.search || 
      event.titre?.toLowerCase().includes(filters.search.toLowerCase())
    
    const categoryMatch = !filters.categorySlugs || 
      filters.categorySlugs.includes(event.categorie_slug)
    
    // Nouveaux filtres
    const paysMatch = !filters.pays_id || event.pays_id === filters.pays_id
    const villeMatch = !filters.ville_id || event.ville_id === filters.ville_id
    const quartierMatch = !filters.quartier_id || event.quartier_id === filters.quartier_id
    
    const modeMatch = !filters.mode || event.mode === filters.mode
    
    const typeMatch = !filters.type_evenement || 
      event.type_evenement === filters.type_evenement
    
    const tagsMatch = !filters.tags || (
      event.tags && 
      Array.isArray(event.tags) && 
      event.tags.includes(filters.tags)
    )
    
    const capacityMatch = !filters.hasCapacity || 
      (event.capacite && event.capacite > 0)
    
    return searchMatch && categoryMatch && paysMatch && villeMatch && 
           quartierMatch && modeMatch && typeMatch && tagsMatch && capacityMatch
  })
}, [filters, allEvents])
Configuration des filtres
// Filtres principaux
const mainFiltersConfig = [
  {
    name: "mode",
    label: "Mode",
    icon: "Video",
    options: [
      { label: "Tous", value: undefined },
      { label: "En ligne", value: "en_ligne" },
      { label: "Présentiel", value: "presentiel" },
      { label: "Hybride", value: "hybride" }
    ]
  },
  {
    name: "type_evenement",
    label: "Type",
    icon: "Tag",
    options: [
      { label: "Tous", value: undefined },
      ...availableTypes.map(type => ({ label: type, value: type }))
    ]
  }
]
// Filtres de localisation
const locationFiltersConfig = [
  {
    name: "pays_id",
    label: "Pays",
    icon: "MapPin",
    options: [
      { label: "Tous les pays", value: undefined },
      ...locations.countries.map(c => ({ label: c.nom, value: c.id }))
    ]
  },
  {
    name: "ville_id",
    label: "Ville",
    icon: "Building2",
    options: [
      { label: "Toutes les villes", value: undefined },
      ...locations.villes
        .filter(v => !filters.pays_id || v.pays_id === filters.pays_id)
        .map(v => ({ label: v.nom, value: v.id }))
    ]
  },
  {
    name: "quartier_id",
    label: "Quartier",
    icon: "Home",
    options: [
      { label: "Tous les quartiers", value: undefined },
      ...locations.quartiers
        .filter(q => !filters.ville_id || q.ville_id === filters.ville_id)
        .map(q => ({ label: q.nom, value: q.id }))
    ]
  }
]
🎨 Adaptations par type de contenu
Événements
Filtres : Localisation (cascade), Mode, Type, Tags, Capacité, Dates Particularités : Filtrage par dates (aujourd'hui, cette semaine, ce mois)

Clubs
Filtres : Tags, Capacité, Statut, Thème, Lieu (texte libre) Particularités : Pas de localisation cascade, lieu est un champ texte

// Pour clubs - pas de cascade
const [availableLieux, setAvailableLieux] = useState<string[]>([])
// Fetch
const { data: lieuxData } = await getDistinctClubLocations()
if (lieuxData) setAvailableLieux(lieuxData)
// Config
{
  name: "lieu",
  label: "Lieu",
  icon: "MapPin",
  options: [
    { label: "Tous les lieux", value: undefined },
    ...availableLieux.map(l => ({ label: l, value: l }))
  ]
}
Blogs
Filtres : Tags, Popularité (vues, likes) Particularités : Filtres numériques pour vues et likes

// Filtres de popularité
const popularityFiltersConfig = [
  {
    name: "min_vues",
    label: "Vues minimales",
    icon: "Eye",
    options: [
      { label: "Toutes", value: undefined },
      { label: "100+", value: 100 },
      { label: "500+", value: 500 },
      { label: "1000+", value: 1000 }
    ]
  },
  {
    name: "min_likes",
    label: "Likes minimaux",
    icon: "Heart",
    options: [
      { label: "Tous", value: undefined },
      { label: "10+", value: 10 },
      { label: "50+", value: 50 },
      { label: "100+", value: 100 }
    ]
  }
]
📱 UI Mobile et Desktop
Barre mobile
Ajouter les nouveaux filtres dans la barre horizontale scrollable :

{/* Tags filter */}
{availableTags.length > 0 && (
  <CustomBottomSheet>
    <CustomBottomSheetTrigger asChild>
      <Button variant={filters.tags ? "default" : "outline"} size="sm">
        <Tag size={16} className="mr-1.5" />
        {filters.tags || "Tags"}
      </Button>
    </CustomBottomSheetTrigger>
    <CustomBottomSheetContent>
      <CustomBottomSheetHeader>
        <CustomBottomSheetTitle>Filtrer par Tags</CustomBottomSheetTitle>
      </CustomBottomSheetHeader>
      <div className="grid grid-cols-2 gap-2">
        {availableTags.map(tag => (
          <CustomBottomSheetClose asChild key={tag}>
            <Button
              variant={filters.tags === tag ? "default" : "outline"}
              onClick={() => handleFilterChange("tags", tag)}
            >
              {tag}
            </Button>
          </CustomBottomSheetClose>
        ))}
      </div>
    </CustomBottomSheetContent>
  </CustomBottomSheet>
)}
Sidebar desktop
Passer les nouvelles configurations à la sidebar :

<EvenementSidebar
  filters={filters}
  handleFilterChange={handleFilterChange}
  mainFiltersConfig={mainFiltersConfig}
  locationFiltersConfig={locationFiltersConfig}
  secondaryFiltersConfig={secondaryFiltersConfig}
  locations={locations}
  availableTags={availableTags}
/>
🧪 Tests à effectuer
Pour chaque page :

 Les données se chargent correctement
 Les filtres s'affichent avec les bonnes options
 Le filtrage fonctionne pour chaque critère
 La cascade fonctionne (événements)
 Le bottom sheet est scrollable
 Les filtres fonctionnent sur mobile et desktop
 Le reset des filtres fonctionne
🐛 Points d'attention
Noms de champs : Utiliser categorie_slug (pas category_slug)
Tags : Vérifier que c'est un tableau avec Array.isArray()
Capacité : Vérifier > 0 pour "places disponibles"
Client admin : Toutes les actions serveur utilisent déjà le bon client
Cast SQL : Déjà fait avec tags::text[]
📞 Prochaines étapes
Mettre à jour 
evenements-filter-wrapper.tsx
Mettre à jour 
evenement-sidebar.tsx
Tester les événements
Répéter pour clubs
Répéter pour blogs
Tous les fichiers SQL et actions serveur sont prêts et fonctionnels ! 🚀