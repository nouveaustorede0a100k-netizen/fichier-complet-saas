'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp, signInWithMagicLink } = useAuth()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Connexion réussie !')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer.')
    }
    setLoading(false)
  }

  const handleMagicLink = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await signInWithMagicLink(email)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Lien magique envoyé ! Vérifiez votre email.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Drop Eazy</h1>
          <p className="text-gray-600 mt-2">
            Votre assistant IA pour réussir en ligne
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Bienvenue !</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        Se connecter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Lien magique par email
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer un compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                En continuant, vous acceptez nos{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Débloquez la puissance de l'IA pour :</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full">🔍 Recherche de tendances</span>
            <span className="bg-white px-3 py-1 rounded-full">📦 Analyse de produits</span>
            <span className="bg-white px-3 py-1 rounded-full">🎁 Génération d'offres</span>
            <span className="bg-white px-3 py-1 rounded-full">📢 Création de pubs</span>
            <span className="bg-white px-3 py-1 rounded-full">🚀 Plans de lancement</span>
          </div>
        </div>
      </div>
    </div>
  )
}
