import React from 'react';
import { useForm /*, Controller */ } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';

interface QuestionFormData {
  text: string;
  type: string;
  difficulty: string;
  tags: string[];
  options: string[];
  answer: string;
}

interface QuestionEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: QuestionFormData) => void;
  initialData?: Partial<QuestionFormData>;
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TYPES = ['MCQ', 'True/False', 'Short Answer'];

export function QuestionEditor({
  open,
  onClose,
  onSave,
  initialData,
}: QuestionEditorProps) {
  const { register, handleSubmit, watch /*, control */, reset } =
    useForm<QuestionFormData>({
      defaultValues: initialData || {
        text: '',
        type: 'MCQ',
        difficulty: 'Medium',
        tags: [],
        options: ['', '', '', ''],
        answer: '',
      },
    });

  const type = watch('type');

  React.useEffect(() => {
    if (open)
      reset(
        initialData || {
          text: '',
          type: 'MCQ',
          difficulty: 'Medium',
          tags: [],
          options: ['', '', '', ''],
          answer: '',
        }
      );
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Question' : 'Create Question'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
          <Input
            {...register('text', { required: true })}
            placeholder="Question text"
          />
          <div className="flex gap-2">
            <Select {...register('type')}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Select {...register('difficulty')}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          {type === 'MCQ' && (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Input
                  key={i}
                  {...register(`options.${i}`)}
                  placeholder={`Option ${i + 1}`}
                />
              ))}
              <Input
                {...register('answer')}
                placeholder="Correct answer (option text)"
              />
            </div>
          )}
          {type === 'True/False' && (
            <Select {...register('answer')}>
              <option value="True">True</option>
              <option value="False">False</option>
            </Select>
          )}
          {type === 'Short Answer' && (
            <Input {...register('answer')} placeholder="Correct answer" />
          )}
          <Input {...register('tags')} placeholder="Tags (comma separated)" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
