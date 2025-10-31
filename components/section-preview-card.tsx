import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SectionPreviewCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
  image?: string
}

export function SectionPreviewCard({ title, description, icon: Icon, href, gradient, image }: SectionPreviewCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 hover:border-primary/50 h-full">
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {image && (
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=400')] bg-cover bg-center opacity-20" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon size={40} className="text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{description}</p>
          <Button variant="ghost" className="group-hover:text-primary p-0 h-auto font-semibold">
            Découvrir
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
