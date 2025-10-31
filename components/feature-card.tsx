import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "from-primary to-secondary",
}: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden">
      <CardContent className="p-6">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}
