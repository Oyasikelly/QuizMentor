'use client';
// TODO: Integrate AI-powered file analysis and feedback for uploaded files.

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

export function ChatInputBar({
  input,
  onInputChange,
  onSend,
  onFileUpload,
  disabled,
}: {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Upload File"
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
        >
          <Paperclip className="w-4 h-4" aria-hidden="true" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          aria-label="Upload a file for AI analysis"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Quick action: Homework Help"
          onClick={() => onInputChange('Can you help me with my homework?')}
          tabIndex={0}
        >
          <HelpCircle className="w-4 h-4 mr-1" aria-hidden="true" /> Homework
          Help
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Quick action: Practice Problem"
          onClick={() => onInputChange('Can you generate a practice problem?')}
          tabIndex={0}
        >
          <BookOpen className="w-4 h-4 mr-1" aria-hidden="true" /> Practice
          Problem
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Quick action: Explain This"
          onClick={() => onInputChange('Can you explain this?')}
          tabIndex={0}
        >
          <Sparkles className="w-4 h-4 mr-1" aria-hidden="true" /> Explain This
        </Button>
      </div>
      <form
        className="flex gap-2 mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <textarea
          className="flex-1 rounded border px-3 py-2 resize-none min-h-[40px] max-h-32"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          rows={1}
          disabled={disabled}
          aria-label="Chat input"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button
          type="submit"
          size="sm"
          variant="default"
          disabled={!input.trim() || disabled}
          aria-label="Send message"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
