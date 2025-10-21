"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rocket, TrendingUp, Package, Megaphone, Sparkles, Search } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground text-balance">
              Créez des Business Digitaux
              <br />
              <span className="text-primary">Rentables avec l'IA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Drop Eazy vous aide à identifier les opportunités de marché, créer des offres digitales rentables et lancer votre produit rapidement grâce à l'intelligence artificielle.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/dashboard")} className="gap-2">
              <Sparkles className="w-5 h-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              { icon: TrendingUp, title: "Trend Finder", desc: "Découvrez les niches tendances" },
              { icon: Search, title: "Product Finder", desc: "Trouvez des produits gagnants" },
              { icon: Package, title: "Offer Builder", desc: "Créez des offres percutantes" },
              { icon: Megaphone, title: "Ad Generator", desc: "Générez des pubs performantes" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary transition-colors"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
