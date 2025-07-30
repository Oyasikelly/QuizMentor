import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, X } from 'lucide-react';
import { generateWithAI } from './AIGenerationAPI';

const mockCurricula = ['JAMB', 'WAEC', 'NECO', 'IGCSE', 'SAT'];
const mockTopics = [
  'Algebra',
  'Photosynthesis',
  'World War II',
  'Periodic Table',
  'Shakespeare',
  'Probability',
  'Cell Biology',
  'Electricity',
];

interface AIGenerationResult {
  error?: string;
  content?: string;
  type: string;
}

interface Props {
  tab: 'question' | 'explanation' | 'study' | 'assessment';
  onGenerate: (result: AIGenerationResult) => void;
}

export function AIGenerationInputPanel({ tab, onGenerate }: Props) {
  const [curriculum, setCurriculum] = useState(mockCurricula[0]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => setFile(null);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const settings = { difficulty, curriculum, topics: selectedTopics };
    const fileName = file ? file.name : undefined;
    const result = await generateWithAI({
      type: tab,
      prompt,
      settings,
      file: fileName,
    });
    if (result.error) setError(result.error);
    else onGenerate(result);
    setLoading(false);
  };

  return (
    <div className="bg-muted/40 rounded p-4 mb-4">
      <h2 className="font-semibold mb-2">
        {tab.charAt(0).toUpperCase() + tab.slice(1)} Generation
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-medium">Curriculum</label>
          <select
            className="border rounded p-1 mb-2"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            disabled={loading}
          >
            {mockCurricula.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="font-medium">Topics</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {mockTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`px-2 py-1 rounded border text-xs ${
                  selectedTopics.includes(topic)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-muted-foreground'
                }`}
                onClick={() => handleTopicToggle(topic)}
                disabled={loading}
              >
                {topic}
              </button>
            ))}
          </div>
          <textarea
            className="border rounded p-2 min-h-[60px]"
            placeholder={`Describe what you want to generate (e.g., &apos;Generate 5 MCQs on photosynthesis&apos;)`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="font-medium">Upload Source File</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="ai-gen-file-upload"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Button
              asChild
              variant="default"
              type="button"
              className="w-full"
              disabled={loading}
            >
              <label
                htmlFor="ai-gen-file-upload"
                className="w-full flex items-center cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                {file ? 'Change File' : 'Upload'}
              </label>
            </Button>
            {file && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleRemoveFile}
                aria-label="Remove file"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {file && (
            <div className="text-xs text-muted-foreground truncate">
              Selected: {file.name}
            </div>
          )}
          <label className="font-medium mt-2">Difficulty</label>
          <select
            className="border rounded p-1"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <Button
            variant="default"
            className="mt-4"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            <Sparkles className=" w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
      {error && <div className="text-destructive text-sm mt-2">{error}</div>}
      <div className="text-xs text-muted-foreground mt-2">
        TODO: Real file upload and AI backend integration coming soon.
      </div>
    </div>
  );
}
