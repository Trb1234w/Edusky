import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { ModernHeader } from "@/components/modern/ModernHeader";
import { DiscoverSection } from "@/components/modern/DiscoverSection";
import { NewHero } from "@/components/new-hero";
import { ModernFooter } from "@/components/modern-footer";
import { MobileNav } from "@/components/mobile-nav";
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
import { ClubCard } from "@/components/club-card";
import { ProfesseurCard } from "@/components/professeur-card";
import { HomePostCard } from "@/components/home/home-post-card";
import { SectionSlider } from "@/components/home/section-slider";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch user session for personalized content (likes on posts)
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  const [
    formationsData,
    evenementsData,
    clubsData,
    articlesData,
    professeursData,
    postesData
  ] = await Promise.all([
    supabase.rpc('get_home_page_formations', { p_user_id: currentUserId || null }),
    supabase.rpc('get_home_page_evenements', { p_user_id: currentUserId || null }),
    supabase.rpc('get_home_page_clubs', { p_user_id: currentUserId || null }),
    supabase.rpc('get_home_page_articles', { p_user_id: currentUserId || null }),
    supabase.rpc('get_home_page_professeurs', { p_user_id: currentUserId || null }),
    supabase.rpc('get_home_page_postes')
  ]);

  const formations = formationsData.data || [];
  const evenements = evenementsData.data || [];
  const clubs = clubsData.data || [];
  const articles = articlesData.data || [];
  const professeurs = professeursData.data || [];
  const postes = postesData.data || [];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <ModernHeader />

      <main className="pb-16 lg:pb-0">
        {/* 1. Hero Section */}
        <NewHero />

        {/* 2. Features Grid (Bento) */}
        <BentoFeatures />

        {/* 3. Discover Section (Sliders) */}
        {/* 3. Discover Section (Sliders) */}
        <DiscoverSection>
          {/* Posts Slider */}
          {postes.length > 0 && (
            <SectionSlider
              title="Dernières publications"
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              href="/feed"
            >
              {postes.map((post: any) => (
                <div key={post.id} className="w-[280px] md:w-[300px] h-full snap-start">
                  <HomePostCard {...post} />
                </div>
              ))}
            </SectionSlider>
          )}

          {/* Formations Slider */}
          {formations.length > 0 && (
            <SectionSlider
              title="Formations à la une"
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
              title="Événements à venir"
              icon={<Calendar className="w-5 h-5 text-primary" />}
              href="/evenements"
            >
              {evenements.map((event: any) => (
                <div key={event.id} className="w-[280px] md:w-[320px] h-full snap-start">
                  <EventCard {...event} />
                </div>
              ))}
            </SectionSlider>
          )}

          {/* Professeurs Slider */}
          {professeurs.length > 0 && (
            <SectionSlider
              title="Nos meilleurs professeurs"
              icon={<Users className="w-5 h-5 text-primary" />}
              href="/professeurs"
            >
              {professeurs.map((prof: any) => (
                <div key={prof.id} className="w-[280px] md:w-[300px] h-full snap-start">
                  <ProfesseurCard {...prof} />
                </div>
              ))}
            </SectionSlider>
          )}

          {/* Clubs Slider */}
          {clubs.length > 0 && (
            <SectionSlider
              title="Clubs étudiants"
              icon={<Users className="w-5 h-5 text-primary" />}
              href="/clubs"
            >
              {clubs.map((club: any) => (
                <div key={club.id} className="w-[280px] md:w-[320px] h-full snap-start">
                  <ClubCard {...club} />
                </div>
              ))}
            </SectionSlider>
          )}

          {/* Blog Slider */}
          {articles.length > 0 && (
            <SectionSlider
              title="Articles récents"
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
        <GlassStats />

        {/* 5. How It Works (New) */}
        <HowItWorks />

        {/* 6. Testimonials Section (New) */}
        <Testimonials />

        {/* 7. Modern CTA */}
        <ModernCTA />

      </main >

      <ModernFooter />
      <MobileNav />
    </div >
  );
}
