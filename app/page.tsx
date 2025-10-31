import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { HeroSlider } from "@/components/hero-slider"
import { FeatureCard } from "@/components/feature-card"
import { SectionPreviewCard } from "@/components/section-preview-card"
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
  Star,
  MapPin,
  Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
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
  ]

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
  ]

  const stats = [
    { icon: Users, value: "5000+", label: "Étudiants actifs" },
    { icon: GraduationCap, value: "200+", label: "Professeurs" },
    { icon: BookOpen, value: "150+", label: "Formations" },
    { icon: Award, value: "50+", label: "Événements par an" },
  ]

  const recentEvents = [
    {
      id: 1,
      title: "Hackathon EduTech 2025",
      date: "15 Janvier 2025",
      location: "Conakry",
      participants: 150,
      image: "/hackathon-edutech.jpg",
      category: "Technologie",
    },
    {
      id: 2,
      title: "Conférence IA & Éducation",
      date: "22 Janvier 2025",
      location: "Labé",
      participants: 200,
      image: "/ai-education-conference.jpg",
      category: "Conférence",
    },
    {
      id: 3,
      title: "Concours de Mathématiques",
      date: "28 Janvier 2025",
      location: "Kankan",
      participants: 80,
      image: "/math-competition.jpg",
      category: "Compétition",
    },
    {
      id: 4,
      title: "Atelier Robotique",
      date: "5 Février 2025",
      location: "Conakry",
      participants: 45,
      image: "/robotics-workshop.jpg",
      category: "Atelier",
    },
  ]

  const recentFormations = [
    {
      id: 1,
      title: "Développement Web Moderne",
      instructor: "M. Ibrahima Sow",
      students: 312,
      rating: 4.9,
      duration: "12 semaines",
      level: "Intermédiaire",
      image: "/web-dev-course.jpg",
    },
    {
      id: 2,
      title: "Intelligence Artificielle",
      instructor: "Dr. Mamadou Diallo",
      students: 245,
      rating: 4.8,
      duration: "16 semaines",
      level: "Avancé",
      image: "/ai-course.jpg",
    },
    {
      id: 3,
      title: "Design UI/UX",
      instructor: "Mme. Aissatou Bah",
      students: 189,
      rating: 4.9,
      duration: "8 semaines",
      level: "Débutant",
      image: "/uiux-course.jpg",
    },
    {
      id: 4,
      title: "Marketing Digital",
      instructor: "Dr. Fatoumata Camara",
      students: 198,
      rating: 4.7,
      duration: "10 semaines",
      level: "Intermédiaire",
      image: "/digital-marketing-course.jpg",
    },
  ]

  const recentClubs = [
    {
      id: 1,
      name: "Club Robotique",
      members: 45,
      category: "Technologie",
      description: "Conception et programmation de robots",
      image: "/robotics-club.jpg",
    },
    {
      id: 2,
      name: "Club Débat",
      members: 67,
      category: "Culture",
      description: "Art oratoire et argumentation",
      image: "/debate-club.jpg",
    },
    {
      id: 3,
      name: "Club Écologie",
      members: 89,
      category: "Environnement",
      description: "Protection de l'environnement",
      image: "/ecology-club.jpg",
    },
    {
      id: 4,
      name: "Club Entrepreneuriat",
      members: 123,
      category: "Business",
      description: "Innovation et création d'entreprise",
      image: "/entrepreneurship-club.jpg",
    },
  ]

  const recentArticles = [
    {
      id: 1,
      title: "L'avenir de l'éducation en Guinée",
      author: "Dr. Mamadou Diallo",
      date: "10 Jan 2025",
      category: "Éducation",
      readTime: "5 min",
      image: "/education-future-guinea.jpg",
    },
    {
      id: 2,
      title: "10 conseils pour réussir ses examens",
      author: "Mme. Fatoumata Camara",
      date: "8 Jan 2025",
      category: "Conseils",
      readTime: "7 min",
      image: "/exam-success-tips.jpg",
    },
    {
      id: 3,
      title: "Les métiers d'avenir en Afrique",
      author: "M. Ibrahima Sow",
      date: "5 Jan 2025",
      category: "Carrière",
      readTime: "6 min",
      image: "/future-careers.jpg",
    },
    {
      id: 4,
      title: "Comment développer sa créativité",
      author: "Mme. Aissatou Bah",
      date: "3 Jan 2025",
      category: "Développement",
      readTime: "4 min",
      image: "/creativity-development.jpg",
    },
  ]

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

            {/* Événements récents */}
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
                {recentEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Formations récentes */}
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
                {recentFormations.map((formation, index) => (
                  <Card
                    key={formation.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={formation.image || "/placeholder.svg"}
                        alt={formation.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                        {formation.level}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                        {formation.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{formation.instructor}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{formation.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users size={14} />
                          <span>{formation.students}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formation.duration}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Clubs récents */}
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
                {recentClubs.map((club, index) => (
                  <Card
                    key={club.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={club.image || "/placeholder.svg"}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">{club.category}</Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                        {club.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{club.members} membres</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Articles récents */}
            <div>
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
                {recentArticles.map((article, index) => (
                  <Card
                    key={article.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{article.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{article.author}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{article.date}</span>
                        <span>{article.readTime} de lecture</span>
                      </div>
                    </div>
                  </Card>
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
