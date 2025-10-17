import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, BarChart3, Shield, Zap, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      titleKey: 'landing.features.psychologist.title',
      descriptionKey: 'landing.features.psychologist.description',
      features: t('landing.features.psychologist.features', { returnObjects: true }) as string[]
    },
    {
      icon: Users,
      titleKey: 'landing.features.company.title',
      descriptionKey: 'landing.features.company.description',
      features: t('landing.features.company.features', { returnObjects: true }) as string[]
    },
    {
      icon: BarChart3,
      titleKey: 'landing.features.employee.title',
      descriptionKey: 'landing.features.employee.description',
      features: t('landing.features.employee.features', { returnObjects: true }) as string[]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MindScale
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-smooth"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  {t('auth.login')}
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-smooth"
                >
                  {t('auth.signup')}
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              SaaS Corporativo | Multilíngue | Seguro
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              {t('landing.hero.title')}
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('landing.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('landing.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="gradient-primary text-primary-foreground shadow-glow hover:scale-105 transition-bounce text-lg px-8"
              >
                {t('landing.hero.cta_primary')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                {t('landing.hero.cta_secondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="gradient-card border-2 hover:border-primary/50 transition-smooth hover:shadow-lg"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{t(feature.titleKey)}</CardTitle>
                  <CardDescription className="text-base">
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold">LGPD & GDPR</h3>
              <p className="text-muted-foreground">Conformidade total com regulações de privacidade</p>
            </div>
            <div className="space-y-2">
              <Zap className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Alta Performance</h3>
              <p className="text-muted-foreground">Escalável para milhões de usuários</p>
            </div>
            <div className="space-y-2">
              <Globe2 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Multilíngue</h3>
              <p className="text-muted-foreground">PT-BR, Espanhol e Inglês</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">MindScale</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
