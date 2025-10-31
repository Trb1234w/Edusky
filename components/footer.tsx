"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const shouldShowOnMobile = isHomepage

  const sections = [
    {
      title: "Plateforme",
      links: [
        { label: "Professeurs", href: "/professeurs" },
        { label: "Formations", href: "/formations" },
        { label: "Événements", href: "/evenements" },
        { label: "Clubs", href: "/clubs" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Réseau", href: "/feed" },
        { label: "À propos", href: "/a-propos" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions d'utilisation", href: "/conditions" },
        { label: "Politique de confidentialité", href: "/confidentialite" },
        { label: "Mentions légales", href: "/mentions-legales" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  return (
    <footer className={cn("bg-muted/30 border-t border-border mt-20", !shouldShowOnMobile && "max-lg:hidden")}>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xl">
                E
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduSky
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              La plateforme éducative sociale qui connecte étudiants, professeurs et mentors en Guinée. Découvrez,
              apprenez et grandissez ensemble.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Sections de liens */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EduSky. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
