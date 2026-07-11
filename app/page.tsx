import { BookOpen, Calendar } from "lucide-react";
import { DiscoverSection } from "@/components/modern/DiscoverSection";
import { NewHero } from "@/components/new-hero";
import {
  BentoFeatures,
  GlassStats,
  ModernCTA,
  Testimonials,
  HowItWorks
} from "@/components/modern";

// Import Server Client and Card Components
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course-card";
import { EventCard } from "@/components/event-card";
import { BlogCard } from "@/components/blog-card";
import { SectionSlider } from "@/components/home/section-slider";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch user session for personalized content (likes on posts)
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  const [
    formationsData,
    evenementsData,
    articlesData,
    usersReq,
    professeursReq,
    formationsReq,
  ] = await Promise.all([
    supabase.rpc('get_home_page_formations', { p_user_id: currentUserId || null }),
    supabase.rpc('get_evenements', {
        search_term: null,
        category_slug: null,
        mode_filter: null,
        pays_filter: null,
        ville_filter: null,
        quartier_filter: null,
        type_filter: null,
        sort_by: 'date_debut_asc'
    }),
    supabase.rpc('get_home_page_articles', { p_user_id: currentUserId || null }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'professeur'),
    supabase.from('formations').select('id', { count: 'exact', head: true })
  ]);

  const statsData = {
    students: usersReq.count || 5000,
    mentors: professeursReq.count || 200,
    formations: formationsReq.count || 150,
    successRate: 98
  };

  const formations = formationsData.data || [];
  const evenements = evenementsData.data || [];
  const articles = articlesData.data || [];

  return (
    <main className="flex-1 pb-16 lg:pb-0">
      {/* 1. Hero Section */}
      <NewHero />

      {/* 2. Features Grid (Bento) */}
      <BentoFeatures />

      {/* 3. Discover Section (Sliders) */}
      <DiscoverSection>
        {/* Formations Slider */}
        {formations.length > 0 && (
          <SectionSlider
            title="Formations"
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            href="/formations"
          >
            {formations.map((formation: any) => (
              <div key={formation.id} className="w-[280px] md:w-[320px] h-full snap-start">
                <CourseCard {...formation} />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Événements Slider */}
        {evenements.length > 0 && (
          <SectionSlider
            title="Événements"
            icon={<Calendar className="w-5 h-5 text-primary" />}
            href="/evenements"
          >
            {evenements.map((event: any) => (
              <div key={event.id} className="w-[280px] md:w-[320px] h-full snap-start">
                <EventCard 
                  {...event}
                  title={event.titre || event.title}
                  description={event.extrait || event.description}
                  date={event.date_debut ? new Date(event.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : event.date}
                  time={event.date_debut ? new Date(event.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : event.time}
                  location={event.ville || event.location || "En ligne"}
                  category={event.categorie?.nom || event.category_nom || event.category}
                  price={event.prix || event.price} 
                  isFree={event.est_gratuit || event.isFree} 
                  image={event.image_url || event.image}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Blog Slider */}
        {articles.length > 0 && (
          <SectionSlider
            title="Découvrir"
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            href="/blog"
          >
            {articles.map((article: any) => (
              <div key={article.id} className="w-[280px] md:w-[320px] h-full snap-start">
                <BlogCard {...article} />
              </div>
            ))}
          </SectionSlider>
        )}
      </DiscoverSection>

      {/* 4. Stats Section (Glassmorphism) */}
      <GlassStats data={statsData} />

      {/* 5. How It Works (New) */}
      <HowItWorks />

      {/* 6. Testimonials Section (New) */}
      <Testimonials />

    </main>
  );
}
