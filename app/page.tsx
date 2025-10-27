"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Rocket, 
  TrendingUp, 
  Search, 
  Megaphone, 
  Sparkles, 
  Zap,
  Shield,
  Users,
  BarChart3,
  Check,
  Star,
  Brain,
  Target,
  Clock,
  DollarSign,
  Package
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Brain,
      title: "IA Avancée",
      description: "Notre IA analyse en temps réel les opportunités de marché et vous propose les meilleures stratégies",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Trend Finder",
      description: "Découvrez les tendances émergentes avant vos concurrents et capitalisez sur les opportunités",
      color: "text-green-500"
    },
    {
      icon: Search,
      title: "Product Finder",
      description: "Identifiez les produits digitaux à fort potentiel avec notre analyse de marché complète",
      color: "text-purple-500"
    },
    {
      icon: Megaphone,
      title: "Ad Generator",
      description: "Créez des publicités performantes en quelques clics grâce à l'IA de génération de contenu",
      color: "text-orange-500"
    },
    {
      icon: Target,
      title: "Offer Builder",
      description: "Construisez des offres irrésistibles adaptées à votre audience avec des recommandations personnalisées",
      color: "text-pink-500"
    },
    {
      icon: Rocket,
      title: "Launch Assistant",
      description: "Assistance complète pour lancer votre produit digital rapidement et efficacement",
      color: "text-indigo-500"
    }
  ]

  const benefits = [
    {
      title: "Economisez du temps",
      description: "Automatisez la recherche de tendances et d'opportunités, économisez des heures de travail",
      icon: Clock
    },
    {
      title: "Maximisez vos revenus",
      description: "Identifiez les produits les plus rentables et créez des offres optimisées pour convertir",
      icon: DollarSign
    },
    {
      title: "Réduisez les risques",
      description: "Décisions basées sur les données, pas sur l'intuition. Analysez le marché avant de lancer",
      icon: Shield
    }
  ]

  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Entrepreneuse digitale",
      content: "Drop Eazy m'a permis de lancer 3 produits digitaux rentables en 2 mois. L'IA est incroyablement précise.",
      rating: 5
    },
    {
      name: "Marc Dubois",
      role: "Créateur de contenu",
      content: "Je génère maintenant mes offres et publicités en minutes au lieu d'heures. Game changer!",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Consultante",
      content: "Les analyses de tendances m'aident à rester en avance sur le marché. Outil indispensable!",
      rating: 5
    }
  ]

  const useCases = [
    {
      title: "Créateurs de produits",
      description: "Lancez vos formations, ebooks, templates et logiciels avec des données de marché fiables",
      icon: Package
    },
    {
      title: "Affiliés & Marketeurs",
      description: "Trouvez les meilleurs produits à promouvoir et créez des publicités qui convertissent",
      icon: Megaphone
    },
    {
      title: "Agences & Consultants",
      description: "Servez vos clients avec des stratégies data-driven et des offres optimisées",
      icon: Users
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="secondary" className="px-4 py-1 text-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Propulsé par l'IA
              </Badge>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Créez des Business Digitaux
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Rentables avec l'IA
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Identifiez les opportunités de marché, créez des offres digitales rentables et lancez votre produit rapidement grâce à l'intelligence artificielle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => router.push("/dashboard")} className="gap-2 text-lg px-8 py-6">
                <Rocket className="w-5 h-5" />
                Commencer gratuitement
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/pricing")} className="text-lg px-8 py-6">
                <BarChart3 className="w-5 h-5 mr-2" />
                Voir les tarifs
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Essai gratuit 14 jours
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Sans carte bancaire
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Annulation à tout moment
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin pour
              <br />
              <span className="text-primary">réussir en ligne</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d'outils IA pour créer et lancer vos produits digitaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary">
                  <CardHeader>
                    <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pourquoi nous choisir</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Transformez votre façon de
              <br />
              <span className="text-primary">créer des produits</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Cas d'usage</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Parfait pour
              <br />
              <span className="text-primary">différents profils</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader>
                    <useCase.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {useCase.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Témoignages</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ce que disent nos
              <br />
              <span className="text-primary">utilisateurs</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base mb-4">
                      "{testimonial.content}"
                    </CardDescription>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Prêt à lancer votre premier produit digital ?
            </h2>
            <p className="text-xl opacity-90">
              Commencez gratuitement et transformez vos compétences en business rentable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push("/dashboard")} 
                className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Commencer gratuitement
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push("/pricing")}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
              >
                Voir les tarifs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
