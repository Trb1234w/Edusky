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
} from "lucide-react";

// Import Server Client and Card Components
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course-card";
import { EventCard } from "@/components/event-card";
import { BlogCard } from "@/components/blog-card";
import { ClubCard } from "@/components/club-card";
import { ProfesseurCard } from "@/components/professeur-card";
import { PostCard } from "@/components/post-card";

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
        "Ne manquez aucun événement éducatif : hackathons, conférences, ateliers et compétitions académiques.",
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
    supabase.rpc('get_home_page_formations'),
    supabase.rpc('get_home_page_evenements'),
    supabase.rpc('get_home_page_clubs'),
    supabase.rpc('get_home_page_articles'),
    supabase.rpc('get_home_page_professeurs'),
    supabase.rpc('get_home_page_postes')
  ]);

  const formations = formationsData.data || [];
  const evenements = evenementsData.data || [];
  const clubs = clubsData.data || [];
  const articles = articlesData.data || [];
  const professeurs = professeursData.data || [];
  const postes = postesData.data || [];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <HeroSlider />
        </section>

        {/* Présentation */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
              Bienvenue sur EduSky
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
              La première plateforme éducative sociale de Guinée qui connecte étudiants, professeurs et mentors.
              Découvrez des opportunités d'apprentissage, participez à des événements enrichissants et développez votre
              réseau professionnel.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} data-aos="fade-up" data-aos-delay={index * 150} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
                Découvre EduSky
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                Explore tout ce que notre plateforme a à t'offrir
              </p>
            </div>

            {/* Événements à venir */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="text-primary" size={28} />
                  Événements à venir
                </h3>
                <Link href="/evenements">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {evenements.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>

            {/* Formations populaires */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="text-secondary" size={28} />
                  Formations populaires
                </h3>
                <Link href="/formations">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formations.map((formation) => (
                    <CourseCard key={formation.id} {...formation} />
                ))}
              </div>
            </div>

            {/* Professeurs Vedettes - NOUVELLE SECTION */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="text-primary" size={28} />
                  Nos Professeurs Vedettes
                </h3>
                <Link href="/professeurs">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {professeurs.map((prof) => (
                  <ProfesseurCard key={prof.id} {...prof} />
                ))}
              </div>
            </div>

            {/* Clubs actifs */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Users className="text-accent" size={28} />
                  Clubs actifs
                </h3>
                <Link href="/clubs">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clubs.map((club) => (
                  <ClubCard key={club.id} {...club} />
                ))}
              </div>
            </div>
            
            {/* Articles récents */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Newspaper className="text-primary" size={28} />
                  Articles récents
                </h3>
                <Link href="/blog">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <BlogCard key={article.id} {...article} />
                ))}
              </div>
            </div>

            {/* Actualités Récentes - NOUVELLE SECTION */}
            <div>
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="text-secondary" size={28} />
                  Dernières actualités
                </h3>
                <Link href="/feed">
                  <Button variant="ghost" className="group">
                    Voir plus
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4 max-w-2xl mx-auto">
                {postes.map((post) => (
                  <PostCard 
                    key={post.id} 
                    {...post}
                    liked={false} // This is now handled by the client component
                    currentUserId={currentUserId || ''}
                    followingIds={followingIds}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Sections Preview */}
        <section className="bg-muted/30 py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground text-balance">
                Explorez nos sections
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                Découvrez toutes les fonctionnalités d'EduSky pour enrichir votre parcours éducatif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {sections.map((section, index) => (
                <SectionPreviewCard key={index} {...section} data-aos="fade-up" data-aos-delay={index * 150} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-8 lg:p-16 text-center" data-aos="zoom-in">
            <div className="absolute inset-0 bg-[url('/abstract-education-network.jpg')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <Globe size={64} className="text-white mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
                Rejoignez la communauté EduSky
              </h2>
              <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
                Commencez votre voyage éducatif dès aujourd'hui et connectez-vous avec des milliers d'apprenants et
                d'enseignants à travers la Guinée.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/inscription">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6 rounded-xl shadow-lg"
                  >
                    Créer un compte
                  </Button>
                </Link>
                <Link href="/a-propos">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl bg-transparent"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
