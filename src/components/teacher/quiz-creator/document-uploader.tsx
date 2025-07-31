'use client';

import { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DocumentUploadState,
  AIGenerationSettings,
} from '@/types/quiz-creation';

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

interface DocumentUploaderProps {
  uploadState: DocumentUploadState;
  onUploadStateChange: (state: Partial<DocumentUploadState>) => void;
  onGenerateQuestions: (settings: AIGenerationSettings) => Promise<void>;
}

const ALLOWED_FILE_TYPES = ['.pdf', '.docx', '.txt', '.md'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUploader({
  uploadState,
  onUploadStateChange,
  onGenerateQuestions,
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [generationSettings, setGenerationSettings] =
    useState<AIGenerationSettings>({
      questionCount: 10,
      questionTypes: ['multiple-choice', 'true-false'],
      difficulty: 'Medium',
      topics: [],
      focusAreas: [],
    });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiles = (files: FileList) => {
    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        errors.push(
          `${file.name}: Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(
            ', '
          )}`
        );
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum size: 10MB`);
        return;
      }

      newFiles.push(file);
    });

    if (errors.length > 0) {
      // Show errors
      console.error('Upload errors:', errors);
      return;
    }

    if (newFiles.length > 0) {
      onUploadStateChange({
        files: [...uploadState.files, ...newFiles],
        processingStatus: 'uploading',
      });
      processFiles(newFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    try {
      onUploadStateChange({ processingStatus: 'processing' });

      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let extractedContent = '';
      for (const file of files) {
        const content = await extractTextFromFile(file);
        extractedContent += content + '\n\n';
      }

      onUploadStateChange({
        extractedContent,
        processingStatus: 'complete',
      });
    } catch (error) {
      console.error('File processing error:', error);
      onUploadStateChange({
        processingStatus: 'error',
      });
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // This is a mock implementation
    // In a real app, you'd use libraries like pdf-parse, mammoth, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.readAsText(file);
    });
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = uploadState.files.filter(
      (file) => file !== fileToRemove
    );
    onUploadStateChange({ files: updatedFiles });
  };

  const handleGenerateQuestions = async () => {
    try {
      onUploadStateChange({ processingStatus: 'processing' });
      await onGenerateQuestions(generationSettings);
      onUploadStateChange({ processingStatus: 'complete' });
    } catch (error) {
      console.error('Question generation error:', error);
      onUploadStateChange({ processingStatus: 'error' });
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </CardTitle>
          <CardDescription>
            Upload PDFs, Word documents, or text files to generate questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Supported formats: PDF, DOCX, TXT, MD (Max 10MB per file)
            </p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Choose Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadState.processingStatus === 'uploading' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Uploading files...
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {uploadState.uploadProgress}%
                </span>
              </div>
              <Progress value={uploadState.uploadProgress} className="w-full" />
            </div>
          )}

          {/* Processing Status */}
          {uploadState.processingStatus === 'processing' && (
            <div className="mt-4">
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Processing documents and extracting content...
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Status */}
          {uploadState.processingStatus === 'error' && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error processing files. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Success Status */}
          {uploadState.processingStatus === 'complete' && (
            <div className="mt-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Files processed successfully! Ready to generate questions.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadState.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadState.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generation Settings */}
      {uploadState.processingStatus === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>AI Generation Settings</span>
            </CardTitle>
            <CardDescription>
              Configure how AI should generate questions from your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={generationSettings.questionCount}
                  onChange={(e) =>
                    setGenerationSettings({
                      ...generationSettings,
                      questionCount: parseInt(e.target.value) || 10,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <select
                  value={generationSettings.difficulty}
                  onChange={(e) =>
                    setGenerationSettings({
                      ...generationSettings,
                      difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Types</label>
              <div className="flex flex-wrap gap-2">
                {['multiple-choice', 'true-false', 'short-answer', 'essay'].map(
                  (type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={generationSettings.questionTypes.includes(
                          type as QuestionType
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGenerationSettings({
                              ...generationSettings,
                              questionTypes: [
                                ...generationSettings.questionTypes,
                                type as QuestionType,
                              ],
                            });
                          } else {
                            setGenerationSettings({
                              ...generationSettings,
                              questionTypes:
                                generationSettings.questionTypes.filter(
                                  (t) => t !== type
                                ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Focus Areas (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter topics separated by commas"
                value={generationSettings.focusAreas.join(', ')}
                onChange={(e) =>
                  setGenerationSettings({
                    ...generationSettings,
                    focusAreas: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={handleGenerateQuestions}
              disabled={
                (uploadState.processingStatus as string) === 'processing'
              }
              className="w-full"
            >
              {(uploadState.processingStatus as
                | 'idle'
                | 'uploading'
                | 'processing'
                | 'complete'
                | 'error') === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                'Generate Questions'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Extracted Content Preview */}
      {uploadState.extractedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Content Preview</CardTitle>
            <CardDescription>
              Preview of the content extracted from your documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {uploadState.extractedContent.substring(0, 1000)}
                {uploadState.extractedContent.length > 1000 && '...'}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
