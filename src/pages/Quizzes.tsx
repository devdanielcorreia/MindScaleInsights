import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Plus, Search, Edit, Trash2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Quiz {
  id: string;
  title_pt: string;
  title_es: string;
  title_en: string;
  description_pt: string;
  description_es: string;
  description_en: string;
  is_active: boolean;
  trait_id: string | null;
  created_at: string;
  psychological_traits?: {
    name_pt: string;
    name_es: string;
    name_en: string;
  };
}

const Quizzes = () => {
  const { profile } = useAuth();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [psychologistId, setPsychologistId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role !== 'psychologist') {
      navigate('/dashboard');
      return;
    }
    fetchPsychologistId();
  }, [profile, navigate]);

  useEffect(() => {
    if (psychologistId) {
      fetchQuizzes();
    }
  }, [psychologistId]);

  const fetchPsychologistId = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('psychologists')
      .select('id')
      .eq('profile_id', profile.id)
      .single();

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar dados do psicólogo',
      });
      return;
    }

    setPsychologistId(data.id);
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        psychological_traits (
          name_pt,
          name_es,
          name_en
        )
      `)
      .eq('psychologist_id', psychologistId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar quizzes',
      });
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (quiz: Quiz) => {
    const { error } = await supabase
      .from('quizzes')
      .update({ is_active: !quiz.is_active })
      .eq('id', quiz.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar status',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: `Quiz ${!quiz.is_active ? 'ativado' : 'desativado'}`,
      });
      fetchQuizzes();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return;

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir quiz',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Quiz excluído com sucesso',
      });
      fetchQuizzes();
    }
  };

  const getLocalizedTitle = (quiz: Quiz) => {
    const lang = i18n.language;
    if (lang === 'pt') return quiz.title_pt;
    if (lang === 'es') return quiz.title_es;
    return quiz.title_en;
  };

  const getLocalizedDescription = (quiz: Quiz) => {
    const lang = i18n.language;
    if (lang === 'pt') return quiz.description_pt;
    if (lang === 'es') return quiz.description_es;
    return quiz.description_en;
  };

  const getLocalizedTraitName = (quiz: Quiz) => {
    if (!quiz.psychological_traits) return 'Sem característica';
    const lang = i18n.language;
    if (lang === 'pt') return quiz.psychological_traits.name_pt;
    if (lang === 'es') return quiz.psychological_traits.name_es;
    return quiz.psychological_traits.name_en;
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    getLocalizedTitle(quiz).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              Quizzes
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus instrumentos avaliativos (10 perguntas, 4 alternativas)
            </p>
          </div>
          <Button
            onClick={() => navigate('/quizzes/create')}
            className="gradient-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Quiz
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar quizzes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum quiz encontrado' : 'Nenhum quiz criado ainda'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/quizzes/create')}
                  className="mt-4 gradient-primary text-primary-foreground"
                >
                  Criar Primeiro Quiz
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="gradient-card hover:shadow-lg transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{getLocalizedTitle(quiz)}</CardTitle>
                      <Badge variant="outline" className="text-xs mb-2">
                        {getLocalizedTraitName(quiz)}
                      </Badge>
                    </div>
                    <Badge variant={quiz.is_active ? 'default' : 'secondary'}>
                      {quiz.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {getLocalizedDescription(quiz) || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(quiz)}
                    >
                      {quiz.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(quiz.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
