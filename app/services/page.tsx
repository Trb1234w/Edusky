
import { createClient } from "@/lib/supabase/server";
import { Wrench, Briefcase, Users, GraduationCap, Code, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./ContactForm"; // Composant client pour le formulaire

// --- MAPPING D'ICÔNES ---
const iconMap: { [key: string]: React.ComponentType<any> } = {
    "Consulting & Stratégie": Wrench,
    "Développement SaaS": Code,
    "Recrutement Spécialisé": Briefcase,
    "Orientation Scolaire": GraduationCap,
    "default": Users
};

// --- TYPE DE DONNÉES ---
type Service = {
    service_id: number;
    title: string;
    description: string;
    icon_svg?: string;
    image_url?: string; // Important pour le nouveau design
};


// --- COMPOSANT CARTE DE SERVICE ---
function ServiceCard({ service }: { service: Service }) {
    const IconComponent = service.icon_svg ? iconMap[service.icon_svg] || iconMap.default : iconMap.default;

    return (
        <Link href="#contact-form" className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-500 transform hover:-translate-y-2">
            <div className="relative h-64 w-full">
                {/* Image de fond */}
                <Image
                    src={service.image_url || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80'}
                    alt={`Image pour ${service.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Superposition pour la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Contenu de la carte */}
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 border border-white/20 backdrop-blur-sm">
                        <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                </div>
            </div>
            <div className="p-6 bg-card">
                <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center font-semibold text-primary">
                    <span>Demander un devis</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}


// --- PAGE SERVICES ---
export default async function ServicesPage() {
    const supabase = await createClient();

    const { data: services, error } = await supabase
        .from('services')
        .select('*');

    // Données fictives améliorées avec image_url
    const displayServices: Service[] = (!services || services.length === 0 || error)
        ? [
            { service_id: 1, title: "Consulting & Stratégie", description: "Audit et conseil pour la digitalisation de l'éducation.", icon_svg: "Consulting & Stratégie", image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" },
            { service_id: 2, title: "Développement SaaS", description: "Création de logiciels éducatifs sur mesure et performants.", icon_svg: "Développement SaaS", image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80" },
            { service_id: 3, title: "Recrutement Spécialisé", description: "Nous trouvons les meilleurs talents pour les entreprises EdTech.", icon_svg: "Recrutement Spécialisé", image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80" },
            { service_id: 4, title: "Orientation Scolaire", description: "Accompagnement personnalisé pour trouver sa voie.", icon_svg: "Orientation Scolaire", image_url: "https://images.unsplash.com/photo-1503676260728-1c6ca5961878?w=800&q=80" },
        ]
        : services;

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Section 1: Héros Stratégique */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
                 <div className="absolute inset-0 -z-10 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-gradient-to-b from-transparent to-background" />

                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                                Façonnons l'avenir de l'éducation, <span className="text-primary">ensemble</span>.
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-xl">
                                Chez EduSky, nous ne nous contentons pas de créer des plateformes. Nous bâtissons des écosystèmes d'apprentissage intelligents et offrons une expertise de pointe pour transformer chaque défi en opportunité.
                            </p>
                            <div className="flex gap-4 justify-center lg:justify-start pt-4">
                               <Link href="#services-grid">
                                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg hover:bg-primary/90 transition-colors">Découvrir nos services</button>
                                </Link>
                               <Link href="#contact-form">
                                     <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold shadow-lg hover:bg-secondary/90 transition-colors">Nous contacter</button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative w-full h-80 lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl animate-glow-slow">
                             <div className="absolute inset-0 bg-primary/20 blur-2xl"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=800&q=80"
                                alt="Innovation éducation"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Grille des Services */}
            <section id="services-grid" className="py-16 md:py-24 bg-muted/40">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Une solution pour chaque ambition</h2>
                        <p className="text-muted-foreground mt-4 text-lg">Cliquez sur un service pour nous parler de votre projet. Nous sommes prêts à vous accompagner.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {displayServices.map((service) => (
                            <ServiceCard key={service.service_id} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Formulaire de Contact */}
            <section id="contact-form" className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                     <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Prêt à démarrer un projet ?</h2>
                        <p className="text-muted-foreground mt-4 text-lg">Remplissez ce formulaire et notre équipe vous contactera dans les plus brefs délais pour discuter de vos besoins.</p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                       <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
