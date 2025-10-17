import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Building2,
  FileText,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
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
        {children}
      </main>
    </div>
  );
}
