import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from './button';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: 'json' | 'text' | 'base64';
  error?: string;
  className?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "Enter your code here...",
  language = 'text',
  error,
  className,
  readOnly = false
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatJSON = () => {
    if (language === 'json' && value) {
      try {
        const formatted = JSON.stringify(JSON.parse(value), null, 2);
        onChange(formatted);
      } catch (e) {
        // Invalid JSON, don't format
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "code-block w-full min-h-[300px] p-4 text-sm resize-none",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition-all duration-300",
            error ? "error-glow" : "hover:border-primary/30",
            readOnly && "bg-muted/30"
          )}
          spellCheck={false}
        />
        
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={!value}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Character count */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>{value.length} characters</span>
        {language === 'json' && value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={formatJSON}
            className="text-xs h-auto py-1"
          >
            Format JSON
          </Button>
        )}
      </div>
    </div>
  );
}