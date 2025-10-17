import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ClipboardList, Save, ArrowLeft } from 'lucide-react';

interface PsychologicalTrait {
  id: string;
  name_pt: string;
  name_es: string;
  name_en: string;
}

const CreateQuiz = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [psychologistId, setPsychologistId] = useState<string | null>(null);
  const [traits, setTraits] = useState<PsychologicalTrait[]>([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title_pt: '',
    title_es: '',
    title_en: '',
    description_pt: '',
    description_es: '',
    description_en: '',
    trait_id: '',
  });

  useEffect(() => {
    if (profile?.role !== 'psychologist') {
      navigate('/dashboard');
      return;
    }
    fetchPsychologistId();
  }, [profile, navigate]);

  useEffect(() => {
    if (psychologistId) {
      fetchTraits();
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

  const fetchTraits = async () => {
    const { data, error } = await supabase
      .from('psychological_traits')
      .select('*')
      .eq('psychologist_id', psychologistId)
      .eq('is_active', true)
      .order('name_pt');

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar características',
      });
    } else {
      setTraits(data || []);
    }
  };

  const handleSave = async () => {
    if (!psychologistId) return;

    if (!formData.title_pt || !formData.title_es || !formData.title_en) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha os títulos em todos os idiomas',
      });
      return;
    }

    setSaving(true);

    const { data: quizData, error } = await supabase
      .from('quizzes')
      .insert({
        psychologist_id: psychologistId,
        trait_id: formData.trait_id || null,
        title_pt: formData.title_pt,
        title_es: formData.title_es,
        title_en: formData.title_en,
        description_pt: formData.description_pt,
        description_es: formData.description_es,
        description_en: formData.description_en,
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao criar quiz',
      });
      setSaving(false);
    } else {
      toast({
        title: 'Sucesso',
        description: 'Quiz criado com sucesso! Agora adicione as perguntas.',
      });
      navigate(`/quizzes/${quizData.id}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/quizzes')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              Novo Quiz
            </h1>
            <p className="text-muted-foreground">
              Crie um novo instrumento avaliativo
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha os dados do quiz em todos os idiomas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trait Selection */}
            <div className="space-y-2">
              <Label htmlFor="trait">Característica Psicológica (Opcional)</Label>
              <Select value={formData.trait_id} onValueChange={(value) => setFormData({ ...formData, trait_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma característica" />
                </SelectTrigger>
                <SelectContent>
                  {traits.map((trait) => (
                    <SelectItem key={trait.id} value={trait.id}>
                      {trait.name_pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Portuguese */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                🇧🇷 Português (Brasil)
              </h3>
              <div className="space-y-2">
                <Label htmlFor="title_pt">Título *</Label>
                <Input
                  id="title_pt"
                  value={formData.title_pt}
                  onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                  placeholder="Ex: Avaliação de Liderança"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_pt">Descrição</Label>
                <Textarea
                  id="description_pt"
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                  placeholder="Descreva o objetivo deste quiz..."
                  rows={3}
                />
              </div>
            </div>

            {/* Spanish */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                🇪🇸 Español
              </h3>
              <div className="space-y-2">
                <Label htmlFor="title_es">Título *</Label>
                <Input
                  id="title_es"
                  value={formData.title_es}
                  onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                  placeholder="Ej: Evaluación de Liderazgo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_es">Descripción</Label>
                <Textarea
                  id="description_es"
                  value={formData.description_es}
                  onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                  placeholder="Describe el objetivo de este cuestionario..."
                  rows={3}
                />
              </div>
            </div>

            {/* English */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                🇺🇸 English
              </h3>
              <div className="space-y-2">
                <Label htmlFor="title_en">Title *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Ex: Leadership Assessment"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">Description</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Describe the purpose of this quiz..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/quizzes')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 gradient-primary text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Criar Quiz'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuiz;
