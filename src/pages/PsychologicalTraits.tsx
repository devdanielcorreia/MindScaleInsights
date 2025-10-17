import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Brain, Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/DashboardLayout';

interface PsychologicalTrait {
  id: string;
  name_pt: string;
  name_es: string;
  name_en: string;
  description_pt: string;
  description_es: string;
  description_en: string;
  is_active: boolean;
  created_at: string;
}

const PsychologicalTraits = () => {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [traits, setTraits] = useState<PsychologicalTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrait, setEditingTrait] = useState<PsychologicalTrait | null>(null);
  const [psychologistId, setPsychologistId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_pt: '',
    name_es: '',
    name_en: '',
    description_pt: '',
    description_es: '',
    description_en: '',
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
    setLoading(true);
    const { data, error } = await supabase
      .from('psychological_traits')
      .select('*')
      .eq('psychologist_id', psychologistId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar características',
      });
    } else {
      setTraits(data || []);
    }
    setLoading(false);
  };

  const handleOpenDialog = (trait?: PsychologicalTrait) => {
    if (trait) {
      setEditingTrait(trait);
      setFormData({
        name_pt: trait.name_pt,
        name_es: trait.name_es,
        name_en: trait.name_en,
        description_pt: trait.description_pt || '',
        description_es: trait.description_es || '',
        description_en: trait.description_en || '',
      });
    } else {
      setEditingTrait(null);
      setFormData({
        name_pt: '',
        name_es: '',
        name_en: '',
        description_pt: '',
        description_es: '',
        description_en: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!psychologistId) return;

    if (!formData.name_pt || !formData.name_es || !formData.name_en) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha os nomes em todos os idiomas',
      });
      return;
    }

    if (editingTrait) {
      const { error } = await supabase
        .from('psychological_traits')
        .update(formData)
        .eq('id', editingTrait.id);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao atualizar característica',
        });
      } else {
        toast({
          title: 'Sucesso',
          description: 'Característica atualizada com sucesso',
        });
        fetchTraits();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('psychological_traits')
        .insert({
          ...formData,
          psychologist_id: psychologistId,
        });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao criar característica',
        });
      } else {
        toast({
          title: 'Sucesso',
          description: 'Característica criada com sucesso',
        });
        fetchTraits();
        setIsDialogOpen(false);
      }
    }
  };

  const handleToggleActive = async (trait: PsychologicalTrait) => {
    const { error } = await supabase
      .from('psychological_traits')
      .update({ is_active: !trait.is_active })
      .eq('id', trait.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar status',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: `Característica ${!trait.is_active ? 'ativada' : 'desativada'}`,
      });
      fetchTraits();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta característica?')) return;

    const { error } = await supabase
      .from('psychological_traits')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir característica',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Característica excluída com sucesso',
      });
      fetchTraits();
    }
  };

  const getLocalizedName = (trait: PsychologicalTrait) => {
    const lang = i18n.language;
    if (lang === 'pt') return trait.name_pt;
    if (lang === 'es') return trait.name_es;
    return trait.name_en;
  };

  const getLocalizedDescription = (trait: PsychologicalTrait) => {
    const lang = i18n.language;
    if (lang === 'pt') return trait.description_pt;
    if (lang === 'es') return trait.description_es;
    return trait.description_en;
  };

  const filteredTraits = traits.filter(trait =>
    getLocalizedName(trait).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Características Psicológicas
            </h1>
            <p className="text-muted-foreground">
              Gerencie as características avaliadas em seus quizzes
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="gradient-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Característica
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar características..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Traits Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : filteredTraits.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhuma característica encontrada' : 'Nenhuma característica criada ainda'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTraits.map((trait) => (
              <Card
                key={trait.id}
                className="gradient-card hover:shadow-lg transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{getLocalizedName(trait)}</CardTitle>
                    <Badge variant={trait.is_active ? 'default' : 'secondary'}>
                      {trait.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {getLocalizedDescription(trait) || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(trait)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(trait)}
                    >
                      {trait.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(trait.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTrait ? 'Editar Característica' : 'Nova Característica'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados em todos os idiomas (PT-BR, Espanhol, Inglês)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Portuguese */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  🇧🇷 Português (Brasil)
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="name_pt">Nome</Label>
                  <Input
                    id="name_pt"
                    value={formData.name_pt}
                    onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                    placeholder="Ex: Liderança"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_pt">Descrição</Label>
                  <Textarea
                    id="description_pt"
                    value={formData.description_pt}
                    onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                    placeholder="Descreva a característica..."
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
                  <Label htmlFor="name_es">Nombre</Label>
                  <Input
                    id="name_es"
                    value={formData.name_es}
                    onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                    placeholder="Ej: Liderazgo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_es">Descripción</Label>
                  <Textarea
                    id="description_es"
                    value={formData.description_es}
                    onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                    placeholder="Describe la característica..."
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
                  <Label htmlFor="name_en">Name</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Ex: Leadership"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Description</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Describe the trait..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="gradient-primary text-primary-foreground"
              >
                {editingTrait ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PsychologicalTraits;
