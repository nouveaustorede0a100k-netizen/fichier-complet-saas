"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Rocket, Target, Users, Zap, Shield, TrendingUp, Brain, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Impact",
      description: "Aider les entrepreneurs à réussir en ligne avec des outils IA performants"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Utiliser les dernières technologies d'IA pour automatiser les tâches complexes"
    },
    {
      icon: Users,
      title: "Simplicité",
      description: "Des outils intuitifs accessibles à tous, sans expertise technique requise"
    },
    {
      icon: Shield,
      title: "Confiance",
      description: "Données sécurisées et analyses fiables pour vos décisions importantes"
    }
  ]

  const team = [
    {
      name: "Sophie Martin",
      role: "CEO & Co-Fondatrice",
      bio: "Expert en business digital avec 10 ans d'expérience dans l'entrepreneuriat en ligne."
    },
    {
      name: "Marc Dubois",
      role: "CTO & Co-Fondateur",
      bio: "Ingénieur IA spécialisé dans le machine learning et l'automatisation."
    },
    {
      name: "Lisa Chen",
      role: "Head of Product",
      bio: "Designer UX/UI avec une passion pour créer des expériences utilisateur exceptionnelles."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">À propos de nous</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Notre mission : <span className="text-primary">démocratiser le business digital</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chez Drop Eazy, nous croyons que tout le monde devrait pouvoir créer et lancer des produits digitaux rentables.
            Notre plateforme IA transforme cette vision en réalité.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Notre histoire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg text-muted-foreground">
              <p>
                Drop Eazy est né d'une frustration commune : la difficulté à identifier les bonnes opportunités de marché 
                et à créer des produits digitaux rentables sans passer des semaines en recherche et développement.
              </p>
              <p>
                En tant qu'entrepreneurs digitaux expérimentés, nous avons compris qu'il fallait un outil qui combine 
                l'analyse de tendances, la recherche de produits, et la génération de contenu - le tout assisté par l'IA.
              </p>
              <p>
                Aujourd'hui, des milliers d'entrepreneurs utilisent Drop Eazy pour lancer leurs produits digitaux plus rapidement 
                et avec plus de confiance. Notre mission est de continuer à innover et à faciliter l'entrepreneuriat digital.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-lg text-muted-foreground">
              Les principes qui guident notre travail quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader>
                    <value.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre équipe
            </h2>
            <p className="text-lg text-muted-foreground">
              Des experts passionnés par votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-sm">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Rejoignez l'avenir du business digital
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Commencez à créer des produits rentables dès aujourd'hui avec notre plateforme IA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                  <Link href="/dashboard">
                    <Rocket className="w-5 h-5 mr-2" />
                    Commencer gratuitement
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-lg px-8 py-6">
                  <Link href="/pricing">
                    Voir les tarifs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

