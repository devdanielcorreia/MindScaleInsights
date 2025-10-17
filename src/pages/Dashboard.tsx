import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Building2,
  UserCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate('/auth');
    }
  }, [profile, navigate]);

  const psychologistMenuItems = [
    { icon: Brain, label: 'Características', path: '/traits' },
    { icon: ClipboardList, label: 'Quizzes', path: '/quizzes' },
    { icon: FileText, label: 'Avaliações', path: '/assessments' },
    { icon: Building2, label: 'Empresas', path: '/companies' },
    { icon: BarChart3, label: 'Resultados', path: '/results' },
  ];

  const companyMenuItems = [
    { icon: Users, label: 'Funcionários', path: '/employees' },
    { icon: ClipboardList, label: 'Avaliações', path: '/assessments' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
  ];

  const menuItems = profile?.role === 'psychologist' ? psychologistMenuItems : companyMenuItems;

  const stats = profile?.role === 'psychologist' 
    ? [
        { label: 'Quizzes Ativos', value: '0', icon: ClipboardList, color: 'text-primary' },
        { label: 'Empresas Vinculadas', value: '0', icon: Building2, color: 'text-secondary' },
        { label: 'Avaliações Ativas', value: '0', icon: FileText, color: 'text-accent' },
        { label: 'Total de Respostas', value: '0', icon: BarChart3, color: 'text-primary' },
      ]
    : [
        { label: 'Funcionários', value: '0', icon: Users, color: 'text-primary' },
        { label: 'Avaliações Pendentes', value: '0', icon: ClipboardList, color: 'text-secondary' },
        { label: 'Avaliações Concluídas', value: '0', icon: BarChart3, color: 'text-accent' },
        { label: 'Taxa de Conclusão', value: '0%', icon: BarChart3, color: 'text-primary' },
      ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MindScale</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:block">
              {profile?.full_name}
            </span>
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t(`dashboard.${profile?.role}.welcome`)}, {profile?.full_name}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            {t(`dashboard.${profile?.role}.subtitle`)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="gradient-card hover:shadow-lg transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:border-primary/50 transition-smooth hover:shadow-md"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.label}</CardTitle>
                      <CardDescription>Gerenciar {item.label.toLowerCase()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Suas últimas ações na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <UserCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade recente ainda</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
