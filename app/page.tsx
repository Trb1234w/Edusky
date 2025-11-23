import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { HeroSlider } from "@/components/hero-slider";
import { FeatureCard } from "@/components/feature-card";
import { SectionPreviewCard } from "@/components/section-preview-card";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Users,
  Newspaper,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";

// Import Server Client and Card Components
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course-card";
import { EventCard } from "@/components/event-card";
import { BlogCard } from "@/components/blog-card";
import { ClubCard } from "@/components/club-card";
import { ProfesseurCard } from "@/components/professeur-card";
import { HomePostCard } from "@/components/home/home-post-card";
import { SectionSlider } from "@/components/home/section-slider";

// Keep static data that is not being replaced
const features = [
  {
    icon: GraduationCap,
    title: "Professeurs qualifiés",
    description: "Accédez à un réseau de professeurs et mentors expérimentés dans tous les domaines.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: BookOpen,
    title: "Formations variées",
    description: "Des cours adaptés à tous les niveaux pour développer vos compétences.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Calendar,
    title: "Événements enrichissants",
    description: "Participez à des hackathons, conférences et concours éducatifs.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Users,
    title: "Clubs et activités",
    description: "Rejoignez des clubs scientifiques, sportifs et culturels.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Newspaper,
    title: "Blog éducatif",
    description: "Lisez des articles inspirants et restez informé des tendances éducatives.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: TrendingUp,
    title: "Réseau social",
    description: "Partagez vos expériences et connectez-vous avec la communauté.",
    gradient: "from-accent to-secondary",
  },
];

const sections = [
  {
    title: "Professeurs",
    description:
      "Découvrez des enseignants passionnés et des mentors dévoués prêts à vous accompagner dans votre parcours éducatif.",
    icon: GraduationCap,
    href: "/professeurs",
    gradient: "from-primary to-secondary",
  },
  {
    title: "Formations",
    description:
      "Explorez notre catalogue de formations dans divers domaines : sciences, technologies, arts et bien plus encore.",
    icon: BookOpen,
    href: "/formations",
    gradient: "from-secondary to-accent",
  },
  {
    title: "Événements",
    description:
      "Ne manquez aucun événement important : conférences, ateliers, hackathons et bien plus.",
    icon: Calendar,
    href: "/evenements",
    gradient: "from-accent to-primary",
  },
  {
    title: "Clubs",
    description:
      "Intégrez des clubs et activités extrascolaires pour enrichir votre expérience et développer de nouvelles passions.",
    icon: Users,
    href: "/clubs",
    gradient: "from-primary to-accent",
  },
];

const stats = [
  { icon: Users, value: "5000+", label: "Étudiants actifs" },
  { icon: GraduationCap, value: "200+", label: "Professeurs" },
  { icon: BookOpen, value: "150+", label: "Formations" },
  { icon: Award, value: "50+", label: "Événements par an" },
];


export default async function HomePage() {
  const supabase = await createClient();

  // Fetch user session for personalized content (likes on posts)
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  // For the PostCard, we need the list of users the current user is following.
  // This is a placeholder for now. In a real app, you'd fetch this.
  const followingIds: string[] = [];

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
      <Header />

      <main className="pb-20 lg:pb-0">
        {/* Hero Section */}
        <section className="relative pt-4 pb-8 lg:pt-8 lg:pb-12 overflow-hidden">
          <div className="container px-4 md:px-8">
            <HeroSlider />
          </div>
        </section>

        {/* Features Grid - Compact on mobile */}
        <section className="py-8 bg-muted/30">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-full bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-2`}>
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-semibold">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Derniers Posts Slider */}
        {postes.length > 0 && (
          <SectionSlider
            title="Fil d'actualité"
            href="/feed"
            className="bg-background"
          >
            {postes.map((post: any) => (
              <div key={post.id} className="w-[280px] md:w-[320px]">
                <HomePostCard
                  id={post.id}
                  author={post.author}
                  authorAvatar={post.authorAvatar}
                  authorUsername={post.authorUsername}
                  content={post.content}
                  image={post.image}
                  timestamp={post.timestamp}
                  likes={post.likes || 0}
                  comments={post.comments || 0}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Formations Slider */}
        {formations.length > 0 && (
          <SectionSlider
            title="Formations à la une"
            href="/formations"
            className="bg-muted/30"
          >
            {formations.map((formation: any) => (
              <div key={formation.id} className="w-[280px] md:w-[320px]">
                <CourseCard
                  key={formation.id}
                  id={formation.id}
                  title={formation.title}
                  description={formation.description}
                  instructor={formation.instructor}
                  category={formation.category}
                  level={formation.level}
                  duration={formation.duration}
                  students={formation.students}
                  rating={formation.rating}
                  price={formation.price}
                  image={formation.image}
                  is_favorited={formation.is_favorited || false}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Événements Slider */}
        {evenements.length > 0 && (
          <SectionSlider
            title="Événements à venir"
            href="/evenements"
            className="bg-background"
          >
            {evenements.map((event: any) => (
              <div key={event.id} className="w-[280px] md:w-[320px]">
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  category={event.category}
                  participants={event.participants}
                  maxParticipants={event.maxParticipants}
                  organizer={event.organizer}
                  image={event.image}
                  status={event.status}
                  is_favorited={event.is_favorited || false}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Professeurs Slider */}
        {professeurs.length > 0 && (
          <SectionSlider
            title="Professeurs recommandés"
            href="/professeurs"
            className="bg-muted/30"
          >
            {professeurs.map((prof: any) => (
              <div key={prof.id} className="w-[260px] md:w-[280px]">
                <ProfesseurCard
                  key={prof.id}
                  id={prof.id}
                  name={prof.name}
                  title={prof.title}
                  specialties={prof.specialties}
                  rating={prof.rating}
                  students={prof.students}
                  experience={prof.experience}
                  avatarUrl={prof.avatarUrl}
                  isVerified={prof.isVerified}
                  hasCertifications={prof.hasCertifications}
                  is_favorited={prof.is_favorited || false}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Clubs Slider */}
        {clubs.length > 0 && (
          <SectionSlider
            title="Clubs étudiants"
            href="/clubs"
            className="bg-background"
          >
            {clubs.map((club: any) => (
              <div key={club.id} className="w-[280px] md:w-[320px]">
                <ClubCard
                  key={club.id}
                  id={club.id}
                  name={club.name}
                  description={club.description}
                  category={club.category}
                  members={club.members}
                  activities={club.activities}
                  president={club.president}
                  image={club.image}
                  verified={club.verified}
                  is_favorited={club.is_favorited || false}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Articles Slider */}
        {articles.length > 0 && (
          <SectionSlider
            title="Derniers articles"
            href="/blog"
            className="bg-muted/30"
          >
            {articles.map((article: any) => (
              <div key={article.id} className="w-[280px] md:w-[320px]">
                <BlogCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author}
                  authorRole={article.authorRole}
                  authorAvatar={article.authorAvatar}
                  date={article.date}
                  category={article.category}
                  readTime={article.readTime}
                  image={article.image}
                  views={article.views}
                  likes={article.likes}
                  comments={article.comments}
                  is_favorited={article.is_favorited || false}
                />
              </div>
            ))}
          </SectionSlider>
        )}

        {/* Stats Section */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <stat.icon className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className="text-sm opacity-80">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer votre voyage ?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Rejoignez des milliers d'étudiants et de professeurs sur la plateforme éducative la plus complète.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/inscription">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Créer un compte gratuit
                </Button>
              </Link>
              <Link href="/formations">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Explorer les cours
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
