import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Globe, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            Enterprise AI Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            VenConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, scalable access to Claude 4 Sonnet for teams in Vietnam and Australia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Advanced AI Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access Claude 4 Sonnet with streaming responses, file uploads, and context management
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Multi-Region Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Optimised for teams in Vietnam and Australia with local compliance and low latency
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Auth0 integration, MFA, role-based access control, and full audit logging
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track usage, costs in VND/AUD, and performance metrics across your organisation
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/chat">
            <Button size="lg" className="mr-4">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            View Documentation
          </Button>
        </div>
      </div>
    </main>
  )
}
