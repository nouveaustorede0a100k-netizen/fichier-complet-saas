import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home, ArrowLeft, Rocket } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
            <CardDescription className="text-lg">
              Oups ! La page que vous cherchez n'existe pas.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              La page demandée a peut-être été déplacée, supprimée ou n'existe simplement pas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild className="gap-2">
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard">
                  <Rocket className="w-4 h-4" />
                  Accéder au dashboard
                </Link>
              </Button>
            </div>

            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Suggestions :</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <Link href="/trends" className="p-3 rounded-lg border hover:border-primary transition-colors">
                  <div className="font-semibold">Trend Finder</div>
                  <div className="text-muted-foreground text-xs">Découvrez les tendances</div>
                </Link>
                <Link href="/products" className="p-3 rounded-lg border hover:border-primary transition-colors">
                  <div className="font-semibold">Product Finder</div>
                  <div className="text-muted-foreground text-xs">Trouvez des produits</div>
                </Link>
                <Link href="/pricing" className="p-3 rounded-lg border hover:border-primary transition-colors">
                  <div className="font-semibold">Tarifs</div>
                  <div className="text-muted-foreground text-xs">Voir les plans</div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

