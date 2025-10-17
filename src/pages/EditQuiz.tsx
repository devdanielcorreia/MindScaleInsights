import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Question {
  id?: string;
  text_pt: string;
  text_en: string;
  text_es: string;
  order_number: number;
  alternatives: Alternative[];
}

interface Alternative {
  id?: string;
  text_pt: string;
  text_en: string;
  text_es: string;
  weight: number;
  order_number: number;
}

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [titlePt, setTitlePt] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleEs, setTitleEs] = useState('');
  const [descriptionPt, setDescriptionPt] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [traitId, setTraitId] = useState<string>('');
  const [traits, setTraits] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!profile) return;
    loadData();
  }, [profile, id]);

  const loadData = async () => {
    try {
      // Get psychologist ID
      const { data: psychologist } = await supabase
        .from('psychologists')
        .select('id')
        .eq('profile_id', profile?.id)
        .single();

      if (!psychologist) {
        toast({
          title: 'Error',
          description: 'Psychologist profile not found',
          variant: 'destructive',
        });
        navigate('/quizzes');
        return;
      }

      // Load quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .eq('psychologist_id', psychologist.id)
        .single();

      if (quizError || !quiz) {
        toast({
          title: 'Error',
          description: 'Quiz not found',
          variant: 'destructive',
        });
        navigate('/quizzes');
        return;
      }

      setTitlePt(quiz.title_pt);
      setTitleEn(quiz.title_en);
      setTitleEs(quiz.title_es);
      setDescriptionPt(quiz.description_pt || '');
      setDescriptionEn(quiz.description_en || '');
      setDescriptionEs(quiz.description_es || '');
      setTraitId(quiz.trait_id || '');

      // Load questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_number');

      if (questionsData) {
        const questionsWithAlternatives = await Promise.all(
          questionsData.map(async (q) => {
            const { data: alternatives } = await supabase
              .from('alternatives')
              .select('*')
              .eq('question_id', q.id)
              .order('order_number');

            return {
              id: q.id,
              text_pt: q.text_pt,
              text_en: q.text_en,
              text_es: q.text_es,
              order_number: q.order_number,
              alternatives: alternatives || [],
            };
          })
        );
        setQuestions(questionsWithAlternatives);
      }

      // Load traits
      const { data: traitsData } = await supabase
        .from('psychological_traits')
        .select('*')
        .eq('psychologist_id', psychologist.id)
        .eq('is_active', true)
        .order('name_pt');

      if (traitsData) {
        setTraits(traitsData);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text_pt: '',
        text_en: '',
        text_es: '',
        order_number: questions.length + 1,
        alternatives: [],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions.map((q, i) => ({ ...q, order_number: i + 1 })));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[swapIndex]] = [
      newQuestions[swapIndex],
      newQuestions[index],
    ];

    setQuestions(newQuestions.map((q, i) => ({ ...q, order_number: i + 1 })));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addAlternative = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].alternatives.push({
      text_pt: '',
      text_en: '',
      text_es: '',
      weight: 0,
      order_number: newQuestions[questionIndex].alternatives.length + 1,
    });
    setQuestions(newQuestions);
  };

  const removeAlternative = (questionIndex: number, altIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].alternatives = newQuestions[
      questionIndex
    ].alternatives
      .filter((_, i) => i !== altIndex)
      .map((a, i) => ({ ...a, order_number: i + 1 }));
    setQuestions(newQuestions);
  };

  const updateAlternative = (
    questionIndex: number,
    altIndex: number,
    field: keyof Alternative,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].alternatives[altIndex] = {
      ...newQuestions[questionIndex].alternatives[altIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!titlePt || !titleEn || !titleEs) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all title fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Update quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title_pt: titlePt,
          title_en: titleEn,
          title_es: titleEs,
          description_pt: descriptionPt,
          description_en: descriptionEn,
          description_es: descriptionEs,
          trait_id: traitId || null,
        })
        .eq('id', id);

      if (quizError) throw quizError;

      // Delete existing questions and alternatives
      const { data: existingQuestions } = await supabase
        .from('questions')
        .select('id')
        .eq('quiz_id', id);

      if (existingQuestions && existingQuestions.length > 0) {
        const questionIds = existingQuestions.map((q) => q.id);
        
        await supabase
          .from('alternatives')
          .delete()
          .in('question_id', questionIds);

        await supabase
          .from('questions')
          .delete()
          .eq('quiz_id', id);
      }

      // Insert new questions and alternatives
      for (const question of questions) {
        const { data: newQuestion, error: questionError } = await supabase
          .from('questions')
          .insert({
            quiz_id: id,
            text_pt: question.text_pt,
            text_en: question.text_en,
            text_es: question.text_es,
            order_number: question.order_number,
          })
          .select()
          .single();

        if (questionError) throw questionError;

        if (question.alternatives.length > 0) {
          const { error: alternativesError } = await supabase
            .from('alternatives')
            .insert(
              question.alternatives.map((alt) => ({
                question_id: newQuestion.id,
                text_pt: alt.text_pt,
                text_en: alt.text_en,
                text_es: alt.text_es,
                weight: alt.weight,
                order_number: alt.order_number,
              }))
            );

          if (alternativesError) throw alternativesError;
        }
      }

      toast({
        title: 'Success',
        description: 'Quiz updated successfully',
      });

      navigate('/quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to save quiz',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground">
              Update quiz details, questions, and alternatives
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/quizzes')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
            <CardDescription>
              Basic information about the quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_pt">Title (PT-BR)</Label>
                <Input
                  id="title_pt"
                  value={titlePt}
                  onChange={(e) => setTitlePt(e.target.value)}
                  placeholder="Título em português"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (EN)</Label>
                <Input
                  id="title_en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Title in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_es">Title (ES)</Label>
                <Input
                  id="title_es"
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  placeholder="Título en español"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_pt">Description (PT-BR)</Label>
                <Textarea
                  id="description_pt"
                  value={descriptionPt}
                  onChange={(e) => setDescriptionPt(e.target.value)}
                  placeholder="Descrição em português"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (EN)</Label>
                <Textarea
                  id="description_en"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Description in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_es">Description (ES)</Label>
                <Textarea
                  id="description_es"
                  value={descriptionEs}
                  onChange={(e) => setDescriptionEs(e.target.value)}
                  placeholder="Descripción en español"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trait">Psychological Trait (Optional)</Label>
              <Select value={traitId} onValueChange={setTraitId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {traits.map((trait) => (
                    <SelectItem key={trait.id} value={trait.id}>
                      {trait.name_pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Questions</h2>
          <Button onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No questions yet. Add your first question to get started.
            </CardContent>
          </Card>
        ) : (
          questions.map((question, qIndex) => (
            <Card key={qIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question {qIndex + 1}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(qIndex, 'up')}
                      disabled={qIndex === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(qIndex, 'down')}
                      disabled={qIndex === questions.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Question Text (PT-BR)</Label>
                    <Textarea
                      value={question.text_pt}
                      onChange={(e) =>
                        updateQuestion(qIndex, 'text_pt', e.target.value)
                      }
                      placeholder="Texto da pergunta em português"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Question Text (EN)</Label>
                    <Textarea
                      value={question.text_en}
                      onChange={(e) =>
                        updateQuestion(qIndex, 'text_en', e.target.value)
                      }
                      placeholder="Question text in English"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Question Text (ES)</Label>
                    <Textarea
                      value={question.text_es}
                      onChange={(e) =>
                        updateQuestion(qIndex, 'text_es', e.target.value)
                      }
                      placeholder="Texto de pregunta en español"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Alternatives</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAlternative(qIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Alternative
                  </Button>
                </div>

                {question.alternatives.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No alternatives yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {question.alternatives.map((alt, aIndex) => (
                      <div
                        key={aIndex}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            Alternative {aIndex + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAlternative(qIndex, aIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Text (PT-BR)</Label>
                            <Input
                              value={alt.text_pt}
                              onChange={(e) =>
                                updateAlternative(
                                  qIndex,
                                  aIndex,
                                  'text_pt',
                                  e.target.value
                                )
                              }
                              placeholder="Texto PT"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Text (EN)</Label>
                            <Input
                              value={alt.text_en}
                              onChange={(e) =>
                                updateAlternative(
                                  qIndex,
                                  aIndex,
                                  'text_en',
                                  e.target.value
                                )
                              }
                              placeholder="Text EN"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Text (ES)</Label>
                            <Input
                              value={alt.text_es}
                              onChange={(e) =>
                                updateAlternative(
                                  qIndex,
                                  aIndex,
                                  'text_es',
                                  e.target.value
                                )
                              }
                              placeholder="Texto ES"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Weight</Label>
                            <Input
                              type="number"
                              value={alt.weight}
                              onChange={(e) =>
                                updateAlternative(
                                  qIndex,
                                  aIndex,
                                  'weight',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
